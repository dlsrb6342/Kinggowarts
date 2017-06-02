package com.kinggowarts.map.models;


import lombok.Data;
import javax.persistence.*;

@Data @Entity
public class Coordinate {
    @Id @GeneratedValue
    private long id;
    private double lng;
    private double lat;

    public Coordinate(){
    }

    public Coordinate(double lng, double lat){
        this.lng = lng;
        this.lat = lat;
    }
}
