package com.kinggowarts.event;

import com.kinggowarts.marker.models.Tag;
import org.springframework.beans.factory.annotation.Value;

import java.util.Date;
import java.util.List;

public interface EventProjection {
    long getId();
    @Value("#{target.l_id}")
    long getL_id();
    String getTitle();
    String getAbout();
    @Value("#{target.creator.name}")
    String getCreator();
    List<Tag> getTags();
    @Value("#{target.fromDate}")
    Date getFromDate();
    Date getToDate();
}
