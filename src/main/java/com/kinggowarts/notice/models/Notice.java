package com.kinggowarts.notice.models;

import com.kinggowarts.map.models.Location;
import lombok.Data;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.*;
import java.util.Date;

@Document(indexName="eunjeon", type="notices")
@Data @Entity
public class Notice {
    @Id @GeneratedValue
    private long id;
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name="c_id")
    private NoticeCategory category;
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name="l_id")
    private Location location;
    @Field(type= FieldType.String, analyzer="korean")
    private String title;
    @Lob @Column(columnDefinition="TEXT") @Field(type=FieldType.String, analyzer="korean")
    private String contents;
    private Date time;
    private String link;
    @Lob @Column(columnDefinition="TEXT")
    private String img_src;
}
