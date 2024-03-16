package com.example.backend.mapper;

import java.util.List;
import java.util.function.Function;

import org.apache.jmeter.protocol.http.control.Header;
import org.apache.jmeter.protocol.http.control.HeaderManager;
import org.apache.jmeter.protocol.http.gui.HeaderPanel;
import org.apache.jmeter.testelement.TestElement;
import org.bson.Document;

import com.example.backend.model.JsonFieldModel;

public class HeaderManagerMapper implements Function<Document, Object> {

	@Override
	public Object apply(Document headerManagerDocument) {
		List<String> headerKeys = headerManagerDocument
				.getList(JsonFieldModel.HEADER_KEYS, String.class);
		List<String> headerValues = headerManagerDocument
				.getList(JsonFieldModel.HEADER_VALUES, String.class);
		
		HeaderManager headerManager = new HeaderManager();
		
		for (int i = 0; i < headerKeys.size(); i++) {
			headerManager.add(new Header(headerKeys.get(i), headerValues.get(i)));
		}
		
		headerManager.setProperty(TestElement.TEST_CLASS, HeaderManager.class.getName());
        headerManager.setProperty(TestElement.GUI_CLASS, HeaderPanel.class.getName());
        return headerManager;
	}

}
