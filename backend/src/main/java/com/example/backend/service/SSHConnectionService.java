package com.example.backend.service;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.bson.Document;
import org.springframework.stereotype.Service;

import com.example.backend.dao.TestPlanDAO;
import com.example.backend.model.JsonFieldModel;
import com.example.backend.model.ServerCommandModel;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SSHConnectionService implements LTSSHConnection {
	
	private final TestPlanDAO testPlanDAO;
	
	private Session session = null;
	
	private ChannelExec channel = null;
	
	private ByteArrayOutputStream serverResponseStream = null;
	
	@Override
	public String getRandomUUID() {
		return UUID.randomUUID().toString();
	}
	
	@Override
	public Boolean openSSHConnection() throws JSchException {
		Document sshSettings = new Document();//findSSHSettings();
		session = new JSch().getSession(
			sshSettings.getString(JsonFieldModel.USER), 
			sshSettings.getString(JsonFieldModel.SERVER), 
			sshSettings.getInteger(JsonFieldModel.PORT)
		);
        session.setPassword(sshSettings.getString(JsonFieldModel.PASSWORD));
        session.setConfig("StrictHostKeyChecking", "no");
        session.connect();
        
        
        return session.isConnected();
	}
	
	@Override
	public Map<String, Object> getLoadFromServer() throws JSchException, InterruptedException {
		Map<String, Object> loadFromServer = new HashMap<>();
		
		channel = (ChannelExec)session.openChannel("exec");
        channel.setCommand(
        	ServerCommandModel.GET_USED_MEMORY_COMMAND + " && " + ServerCommandModel.GET_CPU_LOAD_COMMAND
        );
        serverResponseStream = new ByteArrayOutputStream();
        channel.setOutputStream(serverResponseStream);
		channel.connect();
        while (channel.isConnected()) {
            Thread.sleep(30);
        }
        String responseString = new String(serverResponseStream.toByteArray());
        String[] responseStringArray = responseString.split("\n");
        
        loadFromServer.put(JsonFieldModel.TIMESTAMP, System.currentTimeMillis());
        loadFromServer.put(JsonFieldModel.MEMORY, responseStringArray[0]);
        loadFromServer.put(JsonFieldModel.CPU, responseStringArray[1]);
		return loadFromServer;
	}
	
	@Override
	public Boolean closeSSHConnection() {
		if (session != null) {
            session.disconnect();
        }
        if (channel != null) {
            channel.disconnect();
        }
        return !session.isConnected();
	}
	
	@Override
	public List<Document> findSSHSettings() {
		return testPlanDAO.findSSHSettings();
	}
	
	@Override
	public Document saveSSHSettings(JsonNode sshSettings) {
		ObjectNode savedSSHSettings = 
				((ObjectNode)sshSettings)
					.put(JsonFieldModel.GUID, getRandomUUID());
		Boolean wasSaved = testPlanDAO
				.saveSSHSettings(
					savedSSHSettings
				);
		if (wasSaved)
			return Document.parse(savedSSHSettings.toString());
		return null;
	}
	
	@Override
	public Boolean updateSSHSettings(JsonNode sshSettings) {
		return testPlanDAO.updateSSHSettings(sshSettings);
	}
	
	@Override
	public Boolean deleteSSHSettings(String guid) {
		Boolean wasSSHSettingsDeleted = testPlanDAO.deleteSSHSettings(guid);
		Boolean wasSSHSettingsDocumentDeleted = false;
		if (testPlanDAO.findSSHSettingsQuantity() == 0)
			wasSSHSettingsDocumentDeleted = testPlanDAO.deleteSSHSettingsDocument();
		return wasSSHSettingsDeleted || wasSSHSettingsDocumentDeleted;
	}

}
