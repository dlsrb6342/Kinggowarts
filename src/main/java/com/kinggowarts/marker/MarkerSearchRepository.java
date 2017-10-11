package com.kinggowarts.marker;


import com.kinggowarts.marker.models.Marker;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface MarkerSearchRepository extends ElasticsearchRepository<Marker, Long>{
    List<Marker> findAllByNameContains(String q);
    List<Marker> findAllByNameLike(String q);
    @Query("{\"query\":{\"bool\":{\"must\":{\"nested\":{\"path\":\"tags\",\"query\":{\"bool\":{\"must\":{\"match\":{\"tags.name\":\"*?0*\"}}}}}}}}}")
    List<Marker> findAllByTagsName(String name);
}
