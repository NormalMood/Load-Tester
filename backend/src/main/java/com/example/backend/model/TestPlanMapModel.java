package com.example.backend.model;

import java.util.Map;
import java.util.function.Function;
import static java.util.Map.entry;

import org.bson.Document;

import com.example.backend.mapper.HttpSamplerMapper;
import com.example.backend.mapper.TestPlanMapper;
import com.example.backend.mapper.ThreadGroupMapper;

public class TestPlanMapModel {
	
	public static final Map<String, Function<Document, Object>> TYPE_JMETER_OBJECT = Map.ofEntries(
			entry(TestPlanTypeModel.TEST_PLAN, new TestPlanMapper()),
			entry(TestPlanTypeModel.THREAD_GROUP, new ThreadGroupMapper()),
			entry(TestPlanTypeModel.HTTP_SAMPLER, new HttpSamplerMapper())
	);

}
