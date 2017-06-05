package com.kinggowarts.event;


import com.kinggowarts.event.models.Event;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface EventSearchRepository extends ElasticsearchRepository<Event, Long> {
    List<Event> findAllByTitleContainsOrAboutContains(String title, String about);
    @Query("{\"query\":{\"bool\":{\"must\":{\"nested\":{\"path\":\"tags\",\"query\":{\"bool\":{\"must\":{\"match\":{\"tags.name\":\"*?0*\"}}}}}}}}}")
    List<Event> findAllByTagsName(String name);
}
