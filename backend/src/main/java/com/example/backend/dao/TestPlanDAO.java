package com.example.backend.dao;

import java.util.List;

import org.bson.Document;

import com.fasterxml.jackson.databind.JsonNode;

public interface TestPlanDAO {
	
	Boolean saveTestPlan(Document testPlan);
	
	Document findTestPlan();
	
	Boolean saveTestPlanElement(String parentGuid, JsonNode child);
	
	//Document findParentByParentGuid(String parentGuid);
	
	List<Document> findChildrenByParentGuid(String parentGuid);
	
	Document findTestPlanByGuid(String testPlanGuid);
	
	Boolean updateTestPlanElement(String parentGuid, String guid, JsonNode data);
	
	Boolean deleteTestPlanElementByParentGuid(String parentGuid);
	
	Boolean deleteTestPlanElementByGuid(String parentGuid, String guid);
	
	int findChildrenQuantityByParentGuid(String parentGuid);
	
	List<Document> findSSHSettings();
	
	int findSSHSettingsQuantity();
	
	Boolean saveSSHSettings(JsonNode sshSettings);
	
	Boolean updateSSHSettings(JsonNode sshSettings);
	
	Boolean deleteSSHSettings(String guid);
	
	Boolean deleteSSHSettingsDocument();
	
	void deleteDefaultUserCollection();

}
