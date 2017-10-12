package com.kinggowarts.marker.models;

import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Data
@Entity
@Document(indexName="eunjeon", type="markers")
public class Marker {
    @Id
    @GeneratedValue
    private long id;
    @OneToOne(cascade=CascadeType.ALL, orphanRemoval=true)
    private Coordinate center;
    @OneToMany(cascade=CascadeType.ALL, orphanRemoval=true) @OrderBy("id")
    private List<Coordinate> path;
    @Field(type= FieldType.String, analyzer="korean")
    private String name;
    private String detail;
    @OneToOne
    private MarkerCategory markerCategory;
    private String type;
    @Field(type=FieldType.Nested)
    @OneToMany(cascade=CascadeType.ALL, orphanRemoval=true)
    private List<Tag> tags = new ArrayList<>();
}
