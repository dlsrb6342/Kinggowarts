package com.kinggowarts.marker.models;


import lombok.Data;
import javax.persistence.*;

@Data @Entity
public class Coordinate {
    @Id @GeneratedValue
    private long id;
    private double lng;
    private double lat;
}
