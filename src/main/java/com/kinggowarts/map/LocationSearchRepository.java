package com.kinggowarts.map;

import com.kinggowarts.map.models.Location;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface LocationSearchRepository extends ElasticsearchRepository<Location, Long> {
    List<Location> findAllByNameContainsOrDetailContains(String q);
}
