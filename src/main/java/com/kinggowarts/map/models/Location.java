package com.kinggowarts.map.models;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Data @Entity @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Location {
    @Id @GeneratedValue
    private long id;
    private String name;
    private double center_lng;
    private double center_lat;
    private String type;

    public Location() {

    }
    public Location(String name, double center_lng, double center_lat){
        this.name = name;
        this.center_lat = center_lat;
        this.center_lng = center_lng;
    }
}
