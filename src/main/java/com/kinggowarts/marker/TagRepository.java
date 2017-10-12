package com.kinggowarts.marker;

import com.kinggowarts.marker.models.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository  extends JpaRepository<Tag, Long> {
}
