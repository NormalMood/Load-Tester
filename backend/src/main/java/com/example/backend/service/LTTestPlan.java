package com.example.backend.service;

import java.util.List;
import java.util.Map;

import org.bson.Document;

import com.fasterxml.jackson.databind.JsonNode;

public interface LTTestPlan {
	
	Boolean saveTestPlan(JsonNode testPlan);
	
	Boolean saveTestPlanElement(JsonNode testElement);
	
	Document findParentAndChildrenByParentGuid(String parentGuid);
	
	Boolean updateThreadGroup(JsonNode threadGroup);
	
	Boolean updateTestPlanElements(JsonNode[] testElements);

	void deleteDefaultUserCollection();
	
	List<String[]> startTestPlan(Map<String, String> testPlanGuid);
	
}
