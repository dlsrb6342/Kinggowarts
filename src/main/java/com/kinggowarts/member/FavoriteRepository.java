package com.kinggowarts.member;

import com.kinggowarts.member.models.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<FavoriteProjection> findAllByMember_MemberSeq(Long memSeq);
}
