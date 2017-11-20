package com.kinggowarts.marker;

import com.kinggowarts.marker.models.Coordinate;
import com.kinggowarts.marker.models.Tag;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

public interface MarkerProjection {
    @Value("#{target.id}")
    long getId();
    Coordinate getCenter();
    List<Coordinate> getPath();
    String getName();
    String getDetail();
    List<Tag> getTags();
}
