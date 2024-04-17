package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.service.LTSSHConnection;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SSHConnectionController {
	
	private final LTSSHConnection sshConnection;
	
	@GetMapping("/ssh-connection/settings")
	public ResponseEntity<?> findSSHSettings() {
		return ResponseEntity.ok(sshConnection.findSSHSettings());
	}
	
	@PutMapping("/ssh-connection/settings")
	public ResponseEntity<?> updateSSHSettings(@RequestBody JsonNode sshSettings) {
		return ResponseEntity.ok(sshConnection.updateSSHSettings(sshSettings));
	}

}
