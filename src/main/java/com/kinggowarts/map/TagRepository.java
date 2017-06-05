package com.kinggowarts.map;

import com.kinggowarts.map.models.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository  extends JpaRepository<Tag, Long> {
}
