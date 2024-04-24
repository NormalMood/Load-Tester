package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.service.LTSSHConnection;
import com.fasterxml.jackson.databind.JsonNode;
import com.jcraft.jsch.JSchException;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SSHConnectionController {
	
	private final LTSSHConnection sshConnection;
	
	@GetMapping("/ssh-connection")
	public ResponseEntity<?> openSSHConnection() throws JSchException {
		return ResponseEntity.ok(sshConnection.openSSHConnection());
	}
	
	@GetMapping("/server/memory-cpu")
	public ResponseEntity<?> getLoadFromServer(@RequestParam String sshSettingsGuid) throws JSchException, InterruptedException {
		return ResponseEntity.ok(sshConnection.getLoadFromServerAsync(sshSettingsGuid));
	}
	
	@DeleteMapping("/ssh-connection")
	public ResponseEntity<?> closeSSHConnection() {
		return ResponseEntity.ok(sshConnection.closeSSHConnection());
	}
	
	@GetMapping("/ssh-connection/settings")
	public ResponseEntity<?> findSSHSettings() {
		return ResponseEntity.ok(sshConnection.findSSHSettings());
	}
	
	@PostMapping("/ssh-connection/settings")
	public ResponseEntity<?> saveSSHSettings(@RequestBody JsonNode sshSettings) {
		return ResponseEntity.ok(sshConnection.saveSSHSettings(sshSettings));
	}
	
	@PutMapping("/ssh-connection/settings") 
	public ResponseEntity<?> updateSSHSettings(@RequestBody JsonNode sshSettings) {
		return ResponseEntity.ok(sshConnection.updateSSHSettings(sshSettings));
	}
	
	@DeleteMapping("/ssh-connection/settings")
	public ResponseEntity<?> deleteSSHSettings(@RequestParam String guid) {
		return ResponseEntity.ok(sshConnection.deleteSSHSettings(guid));
	}

}
