package com.kinggowarts.marker.models;

import com.kinggowarts.map.models.Coordinate;
import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;


@Data
@Entity
@Document(indexName="eunjeon", type="markers")
public class Marker {
    @Id
    @GeneratedValue
    private long id;
    @OneToOne
    private Coordinate center;
    @Field(type= FieldType.String, analyzer="korean")
    private String name;
    @OneToOne
    private MarkerCategory markerCategory;
    private String type;
}
