package com.example.backend.service;

import org.bson.Document;

import com.fasterxml.jackson.databind.JsonNode;

public interface LTSSHConnection {
	
	Document findSSHSettings();
	
	Boolean updateSSHSettings(JsonNode sshSettings);

}
