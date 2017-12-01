package com.kinggowarts.member;

import org.springframework.beans.factory.annotation.Value;

import java.util.ArrayList;

public interface FavoriteProjection {
    @Value("#{target.id}")
    long getId();
    long getC_id();
    ArrayList<Long> getP_id();
}
