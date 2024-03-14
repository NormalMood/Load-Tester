package com.example.backend.mapper;

import java.util.function.Function;

import org.apache.jmeter.protocol.http.control.gui.HttpTestSampleGui;
import org.apache.jmeter.protocol.http.sampler.HTTPSamplerProxy;
import org.apache.jmeter.testelement.TestElement;
import org.bson.Document;

import com.example.backend.model.JsonFieldModel;

public class HttpSamplerMapper implements Function<Document, Object> {

	@Override
	public Object apply(Document httpSamplerDocument) {
		HTTPSamplerProxy httpSampler = new HTTPSamplerProxy();
		Document httpSamplerDataDocument = httpSamplerDocument.get(JsonFieldModel.DATA, Document.class);
		httpSampler.setName(httpSamplerDataDocument.get(JsonFieldModel.NAME, ""));
		httpSampler.setMethod(httpSamplerDataDocument.get(JsonFieldModel.METHOD, ""));
		httpSampler.setDomain(httpSamplerDataDocument.get(JsonFieldModel.DOMAIN, ""));
		httpSampler.setPath(httpSamplerDataDocument.get(JsonFieldModel.PATH, ""));
		httpSampler.setPort(httpSamplerDataDocument.getInteger(JsonFieldModel.PORT, 80));
		
		
		
        httpSampler.setProperty(TestElement.TEST_CLASS, HTTPSamplerProxy.class.getName());
        httpSampler.setProperty(TestElement.GUI_CLASS, HttpTestSampleGui.class.getName());
		return httpSampler;
	}

}
