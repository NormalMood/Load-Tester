package com.example.backend.service;

import java.util.Map;

import org.bson.Document;

import com.fasterxml.jackson.databind.JsonNode;
import com.jcraft.jsch.JSchException;

public interface LTSSHConnection {
	
	Boolean openSSHConnection() throws JSchException;
	
	Map<String, Float> getLoadFromServer() throws JSchException, InterruptedException;
	
	Boolean closeSSHConnection();
	
	Document findSSHSettings();
	
	Boolean updateSSHSettings(JsonNode sshSettings);

}
