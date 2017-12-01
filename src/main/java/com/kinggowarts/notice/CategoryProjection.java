package com.kinggowarts.notice;

import org.springframework.beans.factory.annotation.Value;

import java.util.List;

public interface CategoryProjection {
    @Value("#{target.id}")
    long getId();
    String getDetail();
    List<PageProjection> getPages();
    String getType();
}
