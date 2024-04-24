package com.example.backend.service;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

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
	
	private Map<String, Session> openedSessions = null;
	
	private ByteArrayOutputStream serverResponseStream = null;
	
	private ExecutorService executor = Executors.newCachedThreadPool();
	
	@Override
	public String getRandomUUID() {
		return UUID.randomUUID().toString();
	}
	
	@Override
	public List<Document> openSSHConnection() throws JSchException {
        openedSessions = new HashMap<>();
        List<Document> openedSSHConnections = new ArrayList<>();
        List<Document> sshSettingsList = findSSHSettings();
        for(Document sshSettings: sshSettingsList) {
        	if (sshSettings.getBoolean(JsonFieldModel.IS_CONNECTION_ON)) {
        		Session session = new JSch().getSession(
        				sshSettings.getString(JsonFieldModel.USER), 
        				sshSettings.getString(JsonFieldModel.SERVER), 
        				sshSettings.getInteger(JsonFieldModel.PORT)
        		);
        		session.setPassword(sshSettings.getString(JsonFieldModel.PASSWORD));
                session.setConfig("StrictHostKeyChecking", "no");
                session.connect();
                openedSessions.put(sshSettings.getString(JsonFieldModel.GUID), session);
                openedSSHConnections.add(sshSettings);
        	}
        }
        
        return openedSSHConnections;
	}
	
	@Override
	public Map<String, Object> getLoadFromServerAsync(String sshSettingsGuid) throws JSchException {
		Callable<Map<String, Object>> task = () -> getLoadFromServer(sshSettingsGuid);
        Future<Map<String, Object>> future = executor.submit(task);
        try {
            return future.get();
        } catch (Exception e) {
        	e.printStackTrace();
            return new HashMap<>();
        }
	}
	
	@Override
	public Map<String, Object> getLoadFromServer(String sshSettingsGuid) throws JSchException, InterruptedException {
		Map<String, Object> loadFromServer = new HashMap<>();
		
		ChannelExec channel = (ChannelExec)openedSessions.get(sshSettingsGuid).openChannel("exec");
        channel.setCommand(
        	ServerCommandModel.GET_USED_MEMORY_COMMAND + " && " + ServerCommandModel.GET_CPU_LOAD_COMMAND
        );
        serverResponseStream = new ByteArrayOutputStream();
        channel.setOutputStream(serverResponseStream);
		channel.connect();
        while (channel.isConnected()) {
            Thread.sleep(150);
        }
        String responseString = new String(serverResponseStream.toByteArray());
        String[] responseStringArray = responseString.split("\n");
        System.out.println("start");
        System.out.println(responseString);
        System.out.println("end");
        channel.disconnect();
        loadFromServer.put(JsonFieldModel.TIMESTAMP, System.currentTimeMillis());
        loadFromServer.put(JsonFieldModel.MEMORY, responseStringArray[0]);
        loadFromServer.put(JsonFieldModel.CPU, responseStringArray[1]);
		return loadFromServer;
	}
	
	@Override
	public Boolean closeSSHConnection() {
		Set<Boolean> isConnectedResults = new HashSet<>();
		for(Session openedSession: openedSessions.values()) {
			openedSession.disconnect();
			isConnectedResults.add(openedSession.isConnected());
		}
        return !isConnectedResults.contains(true);
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
