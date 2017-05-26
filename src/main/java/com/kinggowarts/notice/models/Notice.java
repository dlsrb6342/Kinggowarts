package com.kinggowarts.notice.models;

import com.kinggowarts.map.models.Location;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data @Entity
public class Notice {
    @Id @GeneratedValue
    private long id;
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name="c_id")
    private Category category;
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name="l_id")
    private Location location;
    private String title;
    @Lob @Column(columnDefinition="TEXT")
    private String contents;
    private Date time;
    private String link;
    @Lob @Column(columnDefinition="TEXT")
    private String img_src;
}
