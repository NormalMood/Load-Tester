package com.example.backend.service;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

import org.bson.Document;
import org.springframework.stereotype.Service;

import com.example.backend.dao.TestPlanDAO;
import com.example.backend.model.JsonFieldModel;
import com.example.backend.model.ServerCommandModel;
import com.fasterxml.jackson.databind.JsonNode;
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
	public Boolean openSSHConnection() throws JSchException {
		Document sshSettings = findSSHSettings();
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
	public Map<String, Float> getLoadFromServer() throws JSchException, InterruptedException {
		Map<String, Float> loadFromServer = new HashMap<>();
		
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
        
        loadFromServer.put(JsonFieldModel.MEMORY, Float.parseFloat(responseStringArray[0]));
        loadFromServer.put(JsonFieldModel.CPU, Float.parseFloat(responseStringArray[1]));
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
	public Document findSSHSettings() {
		return testPlanDAO.findSSHSettings();
	}
	
	@Override
	public Boolean updateSSHSettings(JsonNode sshSettings) {
		String user = null;
		String password = null;
		String server = null;
		if (sshSettings.get(JsonFieldModel.USER) != null)
			user = sshSettings.get(JsonFieldModel.USER).asText();
		if (sshSettings.get(JsonFieldModel.PASSWORD) != null)
			password = sshSettings.get(JsonFieldModel.PASSWORD).asText();
		if (sshSettings.get(JsonFieldModel.SERVER) != null)
			server = sshSettings.get(JsonFieldModel.SERVER).asText();
		int port = 22;
		int interval = 1;
		if (sshSettings.get(JsonFieldModel.PORT) != null)
			port = sshSettings.get(JsonFieldModel.PORT).asInt();
		if (sshSettings.get(JsonFieldModel.INTERVAL) != null)
			interval = sshSettings.get(JsonFieldModel.INTERVAL).asInt();
		return testPlanDAO
				.saveSSHSettings(
					user,
					password,
					server,
					port,
					interval
				);
	}

}