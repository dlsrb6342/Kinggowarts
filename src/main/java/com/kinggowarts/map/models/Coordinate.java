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
}
