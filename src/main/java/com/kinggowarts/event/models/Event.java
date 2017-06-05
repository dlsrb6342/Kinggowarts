package com.kinggowarts.event.models;

import com.kinggowarts.map.models.Tag;
import com.kinggowarts.member.models.Member;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data @Entity @NoArgsConstructor
@Document(indexName="eunjeon",  type="events")
public class Event {
    @Id @GeneratedValue
    private long id;
    private long l_id;
    @Field(type=FieldType.String, analyzer="korean")
    private String title;
    @Field(type=FieldType.String, analyzer="korean")
    private String about;
    @ManyToOne(targetEntity=Member.class)
    @JoinColumn(name="creator_id")
    private Member creator;
    @Field(type=FieldType.Nested)
    @OneToMany(cascade=CascadeType.ALL, orphanRemoval=true)
    private List<Tag> tags = new ArrayList<>();
    private Date fromDate;
    private Date toDate;
}
