package com.kinggowarts.marker;

import com.kinggowarts.marker.models.Coordinate;
import com.kinggowarts.marker.models.Tag;

import java.util.List;

public interface MarkerProjection {
    long getId();
    Coordinate getCenter();
    List<Coordinate> getPath();
    String getName();
    String getDetail();
    List<Tag> getTags();
}
