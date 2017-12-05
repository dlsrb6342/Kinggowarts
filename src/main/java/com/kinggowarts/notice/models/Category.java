package com.kinggowarts.notice.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data @Entity @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Category {
    @Id @GeneratedValue
    private long id;
    private String name;
    private String detail;
    @OneToMany(cascade= CascadeType.ALL, orphanRemoval=true)
    private List<Page> pages;
    private long last_num;
    private String type;
}
