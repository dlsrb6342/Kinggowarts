package com.kinggowarts.map;

import com.kinggowarts.map.models.Coordinate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CoordinateRepository extends JpaRepository<Coordinate, Long>{
    @Query(value="SELECT l_id, lat, lng FROM coordinate ORDER BY l_id", nativeQuery=true)
    List<Object[]> findAllByOrderByLocationIdAsc();
}
