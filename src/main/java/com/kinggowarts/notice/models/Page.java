package com.kinggowarts.notice.models;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import javax.persistence.Id;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;


@Data @Entity @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Page {
    @Id
    @GeneratedValue
    private long id;
    private String detail;
    private long page_id;
    private long time;
    private String type;
}
