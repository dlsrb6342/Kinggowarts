package com.kinggowarts.map;

import com.kinggowarts.map.models.Location;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.elasticsearch.annotations.Query;

import java.util.List;

public interface LocationSearchRepository extends ElasticsearchRepository<Location, Long> {
    List<Location> findAllByNameContains(String q);
    List<Location> findAllByNameLike(String q);
    @Query("{\"query\":{\"bool\":{\"must\":{\"nested\":{\"path\":\"tags\",\"query\":{\"bool\":{\"must\":{\"match\":{\"tags.name\":\"*?0*\"}}}}}}}}}")
    List<Location> findAllByTagsName(String name);
}
