package com.example.backend.config;

import org.apache.jmeter.engine.StandardJMeterEngine;
import org.apache.jmeter.util.JMeterUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import lombok.NoArgsConstructor;

@Configuration
@NoArgsConstructor
public class JMeterConfig {
	
	@Value("${jmeter.home}")
	private String JMeterHomePath = null;
	
	@Value("${jmeter.properties}")
	private String JMeterPropertiesPath = null;
	
	@Value("${jmeter.resultCollector}")
	private String ResultCollectorPath = "";
	
	public static final StandardJMeterEngine jMeterEngine = new StandardJMeterEngine();
	
	@PostConstruct
	private void init() {
		JMeterUtils.setJMeterHome(JMeterHomePath);
		JMeterUtils.loadJMeterProperties(JMeterPropertiesPath);
	}
	
	@Bean
	public String resultCollectorPath() {
		return ResultCollectorPath;
	}

}