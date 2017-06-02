package com.kinggowarts.map;

import com.kinggowarts.map.models.Coordinate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoordinateRepository extends JpaRepository<Coordinate, Long>{
}
