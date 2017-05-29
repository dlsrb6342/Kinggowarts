package com.kinggowarts.member;
import com.kinggowarts.member.models.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Member findFirstByUserId(String userId);
    Member findFirstByNickname(String nickname);
}