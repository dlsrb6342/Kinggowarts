package com.kinggowarts.map.models;


import lombok.Data;
import javax.persistence.*;

@Data @Entity
public class Coordinate {
    @Id @GeneratedValue
    private long id;
    private long sequence_id;
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name="l_id")
    private Location location;
    private double lng;
    private double lat;

    public Coordinate(){

    }

    public Coordinate(long sequence_id, Location location, double lng, double lat){
        this.sequence_id = sequence_id;
        this.location = location;
        this.lng = lng;
        this.lat = lat;
    }
}
