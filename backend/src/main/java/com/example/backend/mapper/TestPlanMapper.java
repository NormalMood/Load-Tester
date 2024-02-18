package com.example.backend.mapper;

import java.util.function.Function;

import org.apache.jmeter.config.Arguments;
import org.apache.jmeter.config.gui.ArgumentsPanel;
import org.apache.jmeter.control.gui.TestPlanGui;
import org.apache.jmeter.testelement.TestElement;
import org.apache.jmeter.testelement.TestPlan;
import org.bson.Document;

public class TestPlanMapper implements Function<Document, Object> {

	@Override
	public Object apply(Document testPlanDocument) {
		TestPlan testPlan = new TestPlan();
		Arguments arguments = new Arguments();
		arguments.setProperty(TestElement.TEST_CLASS, Arguments.class.getName());
        arguments.setProperty(TestElement.GUI_CLASS, ArgumentsPanel.class.getName());
        testPlan.setUserDefinedVariables(arguments);
        testPlan.setProperty(TestElement.TEST_CLASS, TestPlan.class.getName());
        testPlan.setProperty(TestElement.GUI_CLASS, TestPlanGui.class.getName());
		return testPlan;
	}

}
