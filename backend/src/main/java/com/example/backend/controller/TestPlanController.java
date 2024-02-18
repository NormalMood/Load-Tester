package com.example.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.service.LTTestPlan;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TestPlanController {
	
	private final LTTestPlan testPlan;
	
	@PostMapping("/test-plan")
	public ResponseEntity<?> saveTestPlan(@RequestBody JsonNode testPlanRequest) {
		return ResponseEntity.ok(testPlan.saveTestPlan(testPlanRequest));
	}
	
	@PostMapping("/test-plan/element")
	public ResponseEntity<?> saveTestPlanElement(@RequestBody JsonNode testElement) {
		return ResponseEntity.ok(testPlan.saveTestPlanElement(testElement));
	}
	
	@GetMapping("/test-plan/whole-element")
	public ResponseEntity<?> findParentAndChildrenByParentGuid(@RequestParam String parentGuid) {
		return ResponseEntity.ok(testPlan.findParentAndChildrenByParentGuid(parentGuid));
	}
	
	@PutMapping("/test-plan/thread-group")
	public ResponseEntity<?> updateThreadGroup(@RequestBody JsonNode threadGroup) {
		return ResponseEntity.ok(testPlan.updateThreadGroup(threadGroup));
	}
	
	@PutMapping("/test-plan/elements")
	public ResponseEntity<?> updateTestPlanElements(@RequestBody JsonNode[] testElements) {
		return ResponseEntity.ok(testPlan.updateTestPlanElements(testElements));
	}
	
	@DeleteMapping("/collection")
	public ResponseEntity<?> deleteDefaultUserCollection() {
		testPlan.deleteDefaultUserCollection();
		return ResponseEntity.ok().build();
	}
	
	@GetMapping("/test-plan/result")
	public List<String[]> startTestPlan(@RequestParam Map<String, String> testPlanGuid) {
		return testPlan.startTestPlan(testPlanGuid);
	}

}
