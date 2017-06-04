package com.kinggowarts.member.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.*;
import java.util.*;

@Data
@Entity
@NoArgsConstructor
@ToString
@JsonInclude(JsonInclude.Include.NON_NULL)
@Document(indexName="eunjeon", type="members")
public class Member{
    public static final int NOT_CONFIRM = 0;
    public static final int EMAIL_CONFIRM = 1;
    public static final int ADMIN_CONFIRM = 2;
    public static final int COMPLETE_CONFIRM = 3;
    public static final double NULL_COORDINATE_VALUE = -1.0;
    @Id
    @org.springframework.data.annotation.Id
    @GeneratedValue
    private Long memberSeq;

    //@Length(min=5, max=30, message="아이디는 5~30자의 이메일 주소만 가능합니다.")
    //@Email(message="5~30자의 이메일 주소만 가능합니다.")
    private String userId;

    @JsonIgnore
    //@Length(min=6, max=16, message="비밀번호는 6~16자까지 허용합니다.")
    private String passWd;

    //@Length(min=1, max=16, message="닉네임은 1~16자까지 허용합니다.")
    @Field(type= FieldType.String, analyzer="korean")
    private String nickname;


    private String name;
    private Character type;
    private Integer confirm;
    private Double lng = -1.0;
    private Double lat = -1.0;
    //나를 따르는 사람들- 나를 친하다고 생각해주는 사람들
    @ManyToMany
    @JoinTable(name="PEER",
            joinColumns=@JoinColumn(name="TO_SEQ"),
            inverseJoinColumns=@JoinColumn(name="FROM_SEQ"))
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Set<Member> follower = new HashSet<Member>();

    //내가 따르는 사람들- 내가 친하다고 생각하는 사람들
    @ManyToMany
    @JoinTable(name="PEER",
            joinColumns=@JoinColumn(name="FROM_SEQ"),
            inverseJoinColumns=@JoinColumn(name="TO_SEQ"))
    @JsonIgnore
    private Set<Member> following = new HashSet<Member>();

    //나에게 친해지자고 요청을 온 목록
    @ManyToMany(mappedBy = "reqFollowing")
    @JsonIgnore
    private Set<Member> reqFollower = new HashSet<Member>();

    //내가 친해지자고 요청을 보낸 목록
    @ManyToMany
    @JoinTable(name="REQ_PEER",
            joinColumns= {@JoinColumn(name="REQ_FROM_SEQ")},
            inverseJoinColumns= {@JoinColumn(name="REQ_TO_SEQ")})
    @JsonIgnore
    private Set<Member> reqFollowing = new HashSet<Member>();

    public Member(Long memberSeq, String nickname, Double lng, Double lat){
        this.memberSeq = memberSeq;
        this.nickname = nickname;
        this.lng = lng;
        this.lat = lat;
    }
    public Member(Long memberSeq, String nickname){
        this.memberSeq = memberSeq;
        this.nickname = nickname;
    }
}
