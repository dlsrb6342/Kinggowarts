package com.kinggowarts.map;

import com.kinggowarts.map.models.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findAllByType(String type);
}
