package com.kinggowarts.notice.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Data @Entity @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Category {
    @Id @GeneratedValue
    private long id;
    private String name;
    private long page_id;
    private long last_num;
}
