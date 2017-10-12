package com.kinggowarts.marker;

import com.kinggowarts.marker.models.Coordinate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoordinateRepository extends JpaRepository<Coordinate, Long>{
}
