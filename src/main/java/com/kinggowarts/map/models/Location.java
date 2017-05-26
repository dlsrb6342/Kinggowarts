package com.kinggowarts.map.models;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.HashMap;

@Data @Entity @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Location {
    @Id @GeneratedValue
    private long id;
    private String name;
    private double center_lng;
    private double center_lat;
    private String type;
    private String shape;
    private String detail;

    public Location() {

    }
    public Location(String name, HashMap<String, Double> center,
                    String type, String detail, String shape){
        this.name = name;
        this.center_lng = center.get("lng");
        this.center_lat = center.get("lat");
        this.type = type;
        this.detail = detail;
        this.shape = shape;
    }
}
