package com.kinggowarts.member.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import javax.persistence.*;
import java.util.ArrayList;

@Data
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Favorite {
    @Id
    @GeneratedValue
    private long id;
    @ManyToOne(fetch= FetchType.LAZY)
    private Member member;
    private long c_id;
    private ArrayList<Long> p_id;

    public Favorite(){ }
    public Favorite(Member member, long c_id, ArrayList<Long> p_id){
        this.member = member;
        this.c_id = c_id;
        this.p_id = p_id;
    }
}
