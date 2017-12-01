package com.kinggowarts.notice;


import org.springframework.beans.factory.annotation.Value;

public interface PageProjection {
    @Value("#{target.id}")
    long getId();
    String getDetail();
    String getType();
}
