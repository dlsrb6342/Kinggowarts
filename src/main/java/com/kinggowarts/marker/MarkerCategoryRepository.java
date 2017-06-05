package com.kinggowarts.marker;

import com.kinggowarts.marker.models.MarkerCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarkerCategoryRepository extends JpaRepository<MarkerCategory, Long> {
    MarkerCategory findByName(String q);
}
