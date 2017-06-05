package com.kinggowarts.member;

import com.kinggowarts.member.models.Member;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.ArrayList;


public interface MemberSearchRepository extends ElasticsearchRepository<Member, Long>{
    ArrayList<Member> findAllByNicknameLike(String q);
}
