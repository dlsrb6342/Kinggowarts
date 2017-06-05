package com.kinggowarts.map.models;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Document(indexName="eunjeon", type="locations")
@Data @Entity @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Location {
    @Id @GeneratedValue
    private long id;
    @Field(type=FieldType.String, analyzer="korean")
    private String name;
    @OneToOne(cascade=CascadeType.ALL, orphanRemoval=true)
    private Coordinate center;
    @OneToMany(cascade=CascadeType.ALL, orphanRemoval=true) @OrderBy("id")
    private List<Coordinate> path;
    private String type;
    private String shape;
    private String detail;
    @Field(type=FieldType.Nested)
    @OneToMany(cascade=CascadeType.ALL, orphanRemoval=true)
    private List<Tag> tags = new ArrayList<>();
}
