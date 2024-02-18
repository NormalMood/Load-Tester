package com.example.backend.mapper;

import java.util.function.Function;

import org.apache.jmeter.control.LoopController;
import org.apache.jmeter.control.gui.LoopControlPanel;
import org.apache.jmeter.testelement.TestElement;
import org.apache.jmeter.threads.ThreadGroup;
import org.apache.jmeter.threads.gui.ThreadGroupGui;
import org.bson.Document;

import com.example.backend.model.JsonFieldModel;

public class ThreadGroupMapper implements Function<Document, Object> {

	@Override
	public Object apply(Document threadGroupDocument) {
		Document threadGroupDataDocument = threadGroupDocument.get(JsonFieldModel.DATA, Document.class);
		
		LoopController loopController = new LoopController();
		loopController.setLoops(threadGroupDataDocument.getInteger(JsonFieldModel.LOOPS, 1));
		loopController.setProperty(TestElement.TEST_CLASS, LoopController.class.getName());
        loopController.setProperty(TestElement.GUI_CLASS, LoopControlPanel.class.getName());
        loopController.initialize();
        
        ThreadGroup threadGroup = new ThreadGroup();
        threadGroup.setNumThreads(threadGroupDataDocument.getInteger(JsonFieldModel.THREADS, 1));
        threadGroup.setRampUp(threadGroupDataDocument.getInteger(JsonFieldModel.RAMP_UP, 1));
        threadGroup.setSamplerController(loopController);
        threadGroup.setProperty(TestElement.TEST_CLASS, ThreadGroup.class.getName());
        threadGroup.setProperty(TestElement.GUI_CLASS, ThreadGroupGui.class.getName());
		
		return threadGroup;
	}

}
