package com.kinggowarts;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(
		includeFilters = @ComponentScan.Filter(
						type = FilterType.ASSIGNABLE_TYPE, classes = JpaRepository.class))
@EnableElasticsearchRepositories(
		includeFilters = @ComponentScan.Filter(
						type = FilterType.ASSIGNABLE_TYPE, classes = ElasticsearchRepository.class))
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

}
