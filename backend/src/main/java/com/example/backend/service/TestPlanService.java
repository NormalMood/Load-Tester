package com.example.backend.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.bson.Document;
import org.springframework.stereotype.Service;

import com.example.backend.config.JMeterConfig;
import com.example.backend.dao.TestPlanDAO;
import com.example.backend.model.JsonFieldModel;
import com.example.backend.model.TestPlanMapModel;
import com.example.backend.model.TestPlanModel;
import com.example.backend.model.TestPlanTypeModel;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.RequiredArgsConstructor;

import org.apache.jmeter.reporters.ResultCollector;
import org.apache.jmeter.reporters.Summariser;
import org.apache.jmeter.testelement.TestElement;
import org.apache.jmeter.util.JMeterUtils;
import org.apache.jorphan.collections.HashTree;

@Service
@RequiredArgsConstructor
public class TestPlanService implements LTTestPlan {
	
	private final TestPlanDAO testPlanDAO;
	
	private static List<String[]> testResultList = new ArrayList<>();
	
	private final String resultCollectorPath;
	
	@Override
	public String getRandomUUID() {
		return UUID.randomUUID().toString();
	}

	@Override
	public String saveTestPlan() {
		String testPlanUUID = getRandomUUID();
		if (testPlanDAO
				.saveTestPlan(
						(new Document()
							.append(JsonFieldModel.TYPE, TestPlanTypeModel.TEST_PLAN)
							.append(JsonFieldModel.GUID, testPlanUUID)
					)))
			return testPlanUUID;
		return null;
	}
	
	@Override
	public Document findTestPlan() {
		Document testPlan = testPlanDAO.findTestPlan();
		String testPlanUUID = null;
		if (testPlan == null) {
			testPlanUUID = saveTestPlan();
			testPlan = testPlanDAO.findTestPlan();
		}
		if (testPlanUUID != null || testPlan != null)
			return testPlan;
		return null;
	}

	@Override
	public Document saveTestPlanElement(JsonNode testElement) {
		ObjectNode child = 
				((ObjectNode)testElement.get(JsonFieldModel.CHILD))
					.put(JsonFieldModel.GUID, getRandomUUID());
		Boolean wasAcknowledged = testPlanDAO
				.saveTestPlanElement(
						testElement.get(JsonFieldModel.PARENT_GUID).asText(), 
						child
				);
		if (wasAcknowledged)
			return Document.parse(child.toString());
		return null;
	}

	@Override
	public Document findParentAndChildrenByParentGuid(String parentGuid) {
		/*Document testPlan = testPlanDAO.findParentByParentGuid(parentGuid);
		if (testPlan == null) {
			
		}
		List<Document> children = testPlanDAO
				.findChildrenByParentGuid(parentGuid);
		for (Document child : children) {
			child.put(JsonFieldModel.PARENT_GUID, parentGuid);
		}
		return parent.append(JsonFieldModel.CHILDREN, children);*/
		Document parent = testPlanDAO.findParentByParentGuid(parentGuid);
		List<Document> children = testPlanDAO
				.findChildrenByParentGuid(parentGuid);
		for (Document child : children) {
			child.put(JsonFieldModel.PARENT_GUID, parentGuid);
		}
		return parent.append(JsonFieldModel.CHILDREN, children);
	}
	
	@Override
	public Boolean updateThreadGroup(JsonNode threadGroup) {
		return testPlanDAO
				.updateTestPlanElement(
						threadGroup.get(JsonFieldModel.PARENT_GUID).asText(), 
						threadGroup.get(JsonFieldModel.GUID).asText(),
						threadGroup.get(JsonFieldModel.DATA)
					);
	}

	@Override
	public Boolean updateTestPlanElements(JsonNode[] testElements) {
		Set<Boolean> resultSet = new HashSet<>();
		for (JsonNode testElement: testElements) {
			resultSet.add(
					testPlanDAO
					.updateTestPlanElement(
							testElement.get(JsonFieldModel.PARENT_GUID).asText(), 
							testElement.get(JsonFieldModel.GUID).asText(), 
							testElement.get(JsonFieldModel.DATA)
						)
					);
		}
		return !resultSet.contains(false);
	}

	@Override
	public void deleteDefaultUserCollection() {
		testPlanDAO.deleteDefaultUserCollection();
	}
	
	@Override
	public List<String[]> startTestPlan(Map<String, String> testPlanGuid) {
		Deque<HashTree> parentHashTreeQueue = addTestPlanInHashTree(testPlanGuid.get(JsonFieldModel.GUID));
		addTestPlanElementInHashTree(
				testPlanDAO.findChildrenByParentGuid(testPlanGuid.get(JsonFieldModel.GUID)), 
				parentHashTreeQueue
			);
		runTest();
		clearTestPlanHashTree();
		return getTestResult();
	}
	
	private Deque<HashTree> addTestPlanInHashTree(String testPlanGuid) {
		Deque<HashTree> parentHashTreeQueue = new ArrayDeque<>();
		Document testPlanDocument = testPlanDAO.findTestPlanByGuid(testPlanGuid);
		Object testPlan = TestPlanMapModel
				.TYPE_JMETER_OBJECT
					.get(TestPlanTypeModel.TEST_PLAN)
					.apply(testPlanDocument);
		parentHashTreeQueue.addLast(TestPlanModel.testPlanTree.add(testPlan));
		addResultCollectorInHashTree(testPlan);
		
		return parentHashTreeQueue;
	}
	
	private void addTestPlanElementInHashTree(List<Document> children, Deque<HashTree> parentHashTreeQueue) {
		HashTree parentHashTree = parentHashTreeQueue.pollFirst();
		for (Document child: children) {
			parentHashTreeQueue
				.addLast(
						parentHashTree
							.add(
									TestPlanMapModel.TYPE_JMETER_OBJECT
										.get(child.get(JsonFieldModel.TYPE, String.class))
										.apply(child)
								)
					);
			addTestPlanElementInHashTree(
					testPlanDAO
						.findChildrenByParentGuid(child.get(JsonFieldModel.GUID, String.class)), 
					parentHashTreeQueue
				);
		}
	}
	
	private void addResultCollectorInHashTree(Object testPlan) {
		Summariser summer = null;
        String summariserName = JMeterUtils.getPropDefault("summariser.name", "summary");
        if (summariserName.length() > 0) {
            summer = new Summariser(summariserName);
        }
        
        deleteResultCollectorFile();
        
        ResultCollector logger = new ResultCollector(summer);
        logger.setFilename(resultCollectorPath);
        logger.setProperty(TestElement.TEST_CLASS, ResultCollector.class.getName());
        logger.setProperty(TestElement.GUI_CLASS, "SummaryReport");
        
        TestPlanModel.testPlanTree.add(testPlan, logger);
	}
	
	private void deleteResultCollectorFile() {
		new File(resultCollectorPath).delete();
	}
	
	private void clearTestPlanHashTree() {
		TestPlanModel.testPlanTree.clear();
	}
	
	private void runTest() {
		JMeterConfig.jMeterEngine.configure(TestPlanModel.testPlanTree);
		JMeterConfig.jMeterEngine.run();
	}
	
	private List<String[]> getTestResult() {
		testResultList.clear();
		try {
			Files.readAllLines(Paths.get(resultCollectorPath)).forEach(line -> {
				testResultList.add(line.split(","));
			});
		} catch (IOException e) {
			e.printStackTrace();
		}
		return testResultList;
	}

}