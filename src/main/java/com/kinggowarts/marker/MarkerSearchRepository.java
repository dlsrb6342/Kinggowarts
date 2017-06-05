package com.kinggowarts.marker;


import com.kinggowarts.marker.models.Marker;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface MarkerSearchRepository extends ElasticsearchRepository<Marker, Long>{
    List<Marker> findAllByNameContains(String q);
}
