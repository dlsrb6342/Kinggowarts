package com.kinggowarts.notice;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data @Entity
public class Notice {
    @Id
    @GeneratedValue
    private long id;
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name="c_id")
    private Category category;
    private long l_id;
    private String title;
    @Lob @Column(columnDefinition="TEXT")
    private String contents;
    private Date time;
    private String link;
    private String img_src;
}
