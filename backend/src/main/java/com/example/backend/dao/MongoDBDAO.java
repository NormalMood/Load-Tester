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
		return mongoTemplate
				.upsert(query, update, DEFAULT_COLLECTION)
				.getModifiedCount() > 0;
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
		
		return mongoTemplate
				.upsert(query, update, DEFAULT_COLLECTION)
				.getModifiedCount() > 0;
	}

	@Override
	public void deleteDefaultUserCollection() {
		mongoTemplate.dropCollection(DEFAULT_COLLECTION);
	}

}
