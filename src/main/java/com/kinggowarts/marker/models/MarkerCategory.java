package com.kinggowarts.marker.models;


import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Data
@Entity
public class MarkerCategory {
    @Id
    @GeneratedValue
    private long id;
    private String name;
}
