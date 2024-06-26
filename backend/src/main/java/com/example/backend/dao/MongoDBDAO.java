package com.example.backend.dao;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import com.example.backend.model.JsonFieldModel;
import com.example.backend.model.TestPlanTypeModel;
import com.fasterxml.jackson.databind.JsonNode;
import com.mongodb.client.result.UpdateResult;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class MongoDBDAO implements TestPlanDAO {
	
	private final MongoTemplate mongoTemplate;
	
	private final String DEFAULT_COLLECTION = "user1";
	
	@Override
	public Boolean saveTestPlan(Document testPlan) {
		return !mongoTemplate
					.insert(testPlan, DEFAULT_COLLECTION)
					.isEmpty();
	}
	
	@Override
	public Document findTestPlan() {
		Query query = new Query(Criteria.where(JsonFieldModel.TYPE).is(TestPlanTypeModel.TEST_PLAN));
		return mongoTemplate.findOne(query, Document.class, DEFAULT_COLLECTION);
	}

	@Override
	public Boolean saveTestPlanElement(String parentGuid, JsonNode child) {
		Query query = new Query(Criteria.where(JsonFieldModel.PARENT_GUID).is(parentGuid));
		Update update = new Update();
		update.push(JsonFieldModel.CHILDREN, Document.parse(child.toString()));
		UpdateResult result = mongoTemplate.upsert(query, update, DEFAULT_COLLECTION);
		return result.getUpsertedId() != null || result.getModifiedCount() > 0;
	}
	
	/*@Override
	public Document findParentByParentGuid(String parentGuid) {
		Query query = new Query(Criteria
				.where(JsonFieldModel.GUID)
				.is(parentGuid));
		//query.fields().exclude(JsonFieldModel.CHILDREN);
		Document parent = mongoTemplate
				.findOne(query, Document.class, DEFAULT_COLLECTION);
		return parent;
	}*/

	@Override
	public List<Document> findChildrenByParentGuid(String parentGuid) {
		Query query = new Query(Criteria
				.where(JsonFieldModel.PARENT_GUID)
				.is(parentGuid)
			);
		Document document = mongoTemplate
				.findOne(query, Document.class, DEFAULT_COLLECTION);
		if (document == null)
			 return List.of();
		return (List<Document>)document.get(JsonFieldModel.CHILDREN);
	}
	
	@Override
	public Document findTestPlanByGuid(String testPlanGuid) {
		Query query = new Query(Criteria
				.where(JsonFieldModel.GUID)
				.is(testPlanGuid)
			);
		return mongoTemplate.findOne(query, Document.class, DEFAULT_COLLECTION);
	}

	@Override
	public Boolean updateTestPlanElement(String parentGuid, String guid, JsonNode data) {
		List<Criteria> criteria = new ArrayList<>();
		criteria.add(Criteria.where(JsonFieldModel.PARENT_GUID).is(parentGuid));
		criteria
			.add(
					Criteria
						.where(JsonFieldModel.CHILDREN + "." + JsonFieldModel.GUID)
						.is(guid)
				);
		
		Query query = new Query(new Criteria().andOperator(criteria));
		Update update = new Update();
		update.set(JsonFieldModel.CHILDREN + ".$." + JsonFieldModel.DATA, Document.parse(data.toString()));
		
		UpdateResult result = mongoTemplate.upsert(query, update, DEFAULT_COLLECTION);
		return result.getUpsertedId() != null || result.getModifiedCount() > 0;
	}
	
	@Override
	public Boolean deleteTestPlanElementByParentGuid(String parentGuid) {
		Query query = new Query(Criteria.where(JsonFieldModel.PARENT_GUID).is(parentGuid));
		return mongoTemplate.remove(query, DEFAULT_COLLECTION).getDeletedCount() > 0;
	}
	
	@Override
	public Boolean deleteTestPlanElementByGuid(String parentGuid, String guid) {
		Query query = new Query(Criteria.where(JsonFieldModel.PARENT_GUID).is(parentGuid));
		Update update = new Update();
		update.pull(JsonFieldModel.CHILDREN, new Query(Criteria.where(JsonFieldModel.GUID).is(guid)));
		return mongoTemplate
				.updateFirst(query, update, DEFAULT_COLLECTION)
				.getModifiedCount() > 0;
	}
	
	@Override
	public int findChildrenQuantityByParentGuid(String parentGuid) {
		Query query = new Query(Criteria.where(JsonFieldModel.PARENT_GUID).is(parentGuid));
		return mongoTemplate
				.findOne(query, Document.class, DEFAULT_COLLECTION)
				.get(JsonFieldModel.CHILDREN, ArrayList.class)
				.size();
	}
	
	@Override
	public List<Document> findSSHSettings() {
		Query query = new Query(Criteria.where(JsonFieldModel.SSH_SETTINGS).exists(true));
		Document document = mongoTemplate
				.findOne(query, Document.class, DEFAULT_COLLECTION);
		if (document == null)
			return List.of();
		return (List<Document>)document.get(JsonFieldModel.SSH_SETTINGS);
	}
	
	@Override
	public int findSSHSettingsQuantity() {
		Query query = new Query(Criteria.where(JsonFieldModel.SSH_SETTINGS).exists(true));
		return mongoTemplate
				.findOne(query, Document.class, DEFAULT_COLLECTION)
				.get(JsonFieldModel.SSH_SETTINGS, ArrayList.class)
				.size();
	}
	
	@Override
	public Boolean saveSSHSettings(JsonNode sshSettings) {
		Query query = new Query();
		query.addCriteria(Criteria.where(JsonFieldModel.SSH_SETTINGS).exists(true));
		Update update = new Update();
		update.push(JsonFieldModel.SSH_SETTINGS, Document.parse(sshSettings.toString()));
		UpdateResult result = mongoTemplate.upsert(query, update, DEFAULT_COLLECTION);
		return result.getUpsertedId() != null || result.getModifiedCount() > 0;
	}
	
	@Override
	public Boolean updateSSHSettings(JsonNode sshSettings) {
		Query query = new Query(
			Criteria
				.where(JsonFieldModel.SSH_SETTINGS + "." + JsonFieldModel.GUID)
				.is(sshSettings.get(JsonFieldModel.GUID).asText())
		);
		Update update = new Update();
		update.set(JsonFieldModel.SSH_SETTINGS + ".$", Document.parse(sshSettings.toString()));
		UpdateResult result = mongoTemplate.upsert(query, update, DEFAULT_COLLECTION);
		return result.getUpsertedId() != null || result.getModifiedCount() > 0;
	}
	
	@Override
	public Boolean deleteSSHSettings(String guid) {
		Query query = new Query(Criteria.where(JsonFieldModel.SSH_SETTINGS + "." + JsonFieldModel.GUID).is(guid));
		Update update = new Update();
		update.pull(JsonFieldModel.SSH_SETTINGS, new Query(Criteria.where(JsonFieldModel.GUID).is(guid)));
		return mongoTemplate
				.updateFirst(query, update, DEFAULT_COLLECTION)
				.getModifiedCount() > 0;
	}
	
	@Override
	public Boolean deleteSSHSettingsDocument() {
		Query query = new Query(Criteria.where(JsonFieldModel.SSH_SETTINGS).exists(true));
		return mongoTemplate.remove(query, DEFAULT_COLLECTION).getDeletedCount() > 0;
	}

	@Override
	public void deleteDefaultUserCollection() {
		mongoTemplate.dropCollection(DEFAULT_COLLECTION);
	}

}
