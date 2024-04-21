package com.example.backend.service;

import java.util.List;
import java.util.Map;

import org.bson.Document;

import com.fasterxml.jackson.databind.JsonNode;
import com.jcraft.jsch.JSchException;

public interface LTSSHConnection {
	
	String getRandomUUID();
	
	Boolean openSSHConnection() throws JSchException;
	
	Map<String, Object> getLoadFromServer() throws JSchException, InterruptedException;
	
	Boolean closeSSHConnection();
	
	List<Document> findSSHSettings();
	
	Document saveSSHSettings(JsonNode sshSettings);
	
	Boolean updateSSHSettings(JsonNode sshSettings);
	
	Boolean deleteSSHSettings(String guid);

}
