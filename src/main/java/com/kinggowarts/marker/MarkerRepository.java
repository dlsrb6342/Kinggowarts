package com.kinggowarts.marker;

import com.kinggowarts.marker.models.Marker;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarkerRepository extends JpaRepository<Marker, Long>{
    List<MarkerProjection> findAllByMarkerCategory_NameAndMarkerCategory_Type(String q, String type);
    Marker findByName(String q);
}
