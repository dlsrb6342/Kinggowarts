package com.kinggowarts.map.models;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.*;

@Data @Entity
@NoArgsConstructor
public class Tag {
    @Id
    @GeneratedValue
    private long id;
    @Field(type= FieldType.String, analyzer="korean")
    private String name;

    public Tag(String name){
        this.name = name;
    }

    @Override
    public String toString(){
        return this.name;
    }
}
