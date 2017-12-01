package com.kinggowarts.notice;

import com.kinggowarts.marker.MarkerProjection;
import org.springframework.beans.factory.annotation.Value;

import java.util.Date;

public interface NoticeProjection {
    @Value("#{target.id}")
    long getId();
    MarkerProjection getMarker();
    String getTitle();
    String getContents();
    Date getTime();
    String getLink();
    String getImg_src();
}
