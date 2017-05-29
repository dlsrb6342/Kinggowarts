package com.kinggowarts.member.models;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Data
@Entity
public class Member{
    public static final int NOT_CONFIRM = 0;
    public static final int EMAIL_CONFIRM = 1;
    public static final int ADMIN_CONFIRM = 2;
    public static final int COMPLETE_CONFIRM = 3;
    @Id
    @GeneratedValue
    private Long memberSeq;
    private String userId;
    private String passWd;
    private String nickname;
    private Character type;
    private Integer confirm;
}
