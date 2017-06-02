package com.kinggowarts.map.models;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.*;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Document(indexName="eunjeon", type="locations")
@Data @Entity @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Location {
    @Id @GeneratedValue
    private long id;
    @Field(type=FieldType.String, analyzer="korean")
    private String name;
    @OneToOne()
    private Coordinate center;
    @OneToMany() @OrderBy("id")
    private List<Coordinate> path;
    private String type;
    private String shape;
    private String detail;
    @Field(type=FieldType.Nested) @OneToMany()
    private Set<Tag> tags = new HashSet<>();

    public Location() {
    }

    public Location(String name, Coordinate center,
                    String type, String detail, String shape){
        this.name = name;
        this.center = center;
        this.type = type;
        this.detail = detail;
        this.shape = shape;
    }

    public void addTag(Tag tag){
        this.tags.add(tag);
    }
}
