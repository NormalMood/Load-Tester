package com.example.backend.service;

import org.bson.Document;
import org.springframework.stereotype.Service;

import com.example.backend.dao.TestPlanDAO;
import com.example.backend.model.JsonFieldModel;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SSHConnectionService implements LTSSHConnection {
	
	private final TestPlanDAO testPlanDAO;
	
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
