package com.kinggowarts.marker;


import com.kinggowarts.marker.models.Marker;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface MarkerSearchRepository extends ElasticsearchRepository<Marker, Long>{
    List<MarkerProjection> findAllByNameContains(String q);
    List<MarkerProjection> findAllByNameLike(String q);
    @Query("{\"query\":{\"bool\":{\"must\":{\"nested\":{\"path\":\"tags\",\"query\":{\"bool\":{\"must\":{\"match\":{\"tags.name\":\"*?0*\"}}}}}}}}}")
    List<MarkerProjection> findAllByTagsName(String name);
}
