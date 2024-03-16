package com.example.backend.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import org.apache.jmeter.config.Argument;
import org.apache.jmeter.config.Arguments;
import org.apache.jmeter.protocol.http.control.gui.HttpTestSampleGui;
import org.apache.jmeter.protocol.http.sampler.HTTPSamplerProxy;
import org.apache.jmeter.protocol.http.util.HTTPArgument;
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
		
		httpSampler.setFollowRedirects(true);
		httpSampler.setUseKeepAlive(true);
		
		if (httpSamplerDataDocument.get(JsonFieldModel.BODY_JSON) != null) {
			Arguments arguments = new Arguments();
			
			HTTPArgument httpArgument = new HTTPArgument();
			httpArgument.setValue(httpSamplerDataDocument.getString(JsonFieldModel.BODY_JSON));
			
			List<Argument> argumentList = new ArrayList<>();
			argumentList.add(httpArgument);
			
			arguments.setArguments(argumentList);
			
			httpSampler.setArguments(arguments);
		} 
		
		if ((httpSamplerDataDocument.get(JsonFieldModel.PARAM_KEYS) != null &&
				  httpSamplerDataDocument.getList(JsonFieldModel.PARAM_KEYS, String.class).size() > 0)) {
			List<String> paramKeys = httpSamplerDataDocument
					.getList(JsonFieldModel.PARAM_KEYS, String.class);
			List<String> paramValues = httpSamplerDataDocument
					.getList(JsonFieldModel.PARAM_VALUES, String.class);
			
			Arguments arguments = new Arguments();
			
			List<Argument> argumentList = new ArrayList<>();
			
			for(int i = 0; i < paramKeys.size(); i++) {
				HTTPArgument httpArgument = new HTTPArgument();
				httpArgument.setName(paramKeys.get(i));
				httpArgument.setMetaData("=");
				httpArgument.setValue(paramValues.get(i));
				
				argumentList.add(httpArgument);
			}
			
			arguments.setArguments(argumentList);
			
			httpSampler.setArguments(arguments);
		}
		
        httpSampler.setProperty(TestElement.TEST_CLASS, HTTPSamplerProxy.class.getName());
        httpSampler.setProperty(TestElement.GUI_CLASS, HttpTestSampleGui.class.getName());
        
		return httpSampler;
	}

}
