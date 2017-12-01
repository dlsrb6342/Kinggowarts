package com.kinggowarts.notice;


import com.kinggowarts.notice.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long>{
    @Query("select c from Category c")
    List<CategoryProjection> findAllByProjection();
}
