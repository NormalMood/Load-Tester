package com.example.backend.dao;

import java.util.List;

import org.bson.Document;

import com.fasterxml.jackson.databind.JsonNode;

public interface TestPlanDAO {
	
	Boolean saveTestPlan(JsonNode testPlan);
	
	Boolean saveTestPlanElement(String parentGuid, JsonNode child);
	
	Document findParentByParentGuid(String parentGuid);
	
	List<Document> findChildrenByParentGuid(String parentGuid);
	
	Document findTestPlanByGuid(String testPlanGuid);
	
	Boolean updateTestPlanElement(String parentGuid, String guid, JsonNode data);
	
	void deleteDefaultUserCollection();

}
