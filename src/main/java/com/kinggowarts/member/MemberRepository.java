package com.kinggowarts.member;
import com.kinggowarts.member.models.Member;
import org.hibernate.annotations.NamedNativeQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;
import java.util.List;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Member findFirstByUserId(String userId);

    Member findFirstByNickname(String nickname);

    Member findByMemberSeq(Long memberSeq);

    @Query("SELECT new com.kinggowarts.member.models.Member(mem.memberSeq, mem.nickname, mem.name, mem.profileImgPath) FROM Member mem JOIN mem.reqFollower peer WHERE peer.memberSeq = ?1")
        //This is using a named query method
    ArrayList<Member> findAllRequestFromMe(Long memberSeq);

    @Query("SELECT new com.kinggowarts.member.models.Member(mem.memberSeq, mem.nickname, mem.name, mem.profileImgPath) FROM Member mem JOIN mem.reqFollowing  peer  WHERE peer.memberSeq = ?1")
        //This is using a named query method
    ArrayList<Member> findAllRequestToMe(Long memberSeq);

    @Modifying
    @Query(value = "insert into req_peer values(:fromSeq, :toSeq)", nativeQuery = true)
    void insertPeerReq(@Param("fromSeq") Long fromSeq, @Param("toSeq") Long toSeq);

   // @Query("Select new com.kinggowarts.member.models.Member(mem.memberSeq, mem.nickname, mem.name, mem.profileImgPath) FROM Member mem where mem.memberSeq not in (Select mem2.memberSeq from Member mem2 JOIN mem2.)")
        // @Query("SELECT mem.memberSeq, mem.nickname, mem.userId, mem.lng, mem.lat FROM Member mem JOIN mem.follower peer WHERE peer.memberSeq = ?1")
   @Query("Select new com.kinggowarts.member.models.Member(mem.memberSeq, mem.nickname, mem.name, mem.profileImgPath) FROM Member mem where mem.nickname like CONCAT('%',:searchParam,'%') and mem.memberSeq not in (Select mem2.memberSeq from Member mem2 JOIN mem2.reqFollowing peer WHERE peer.memberSeq = :mySeq) and mem.memberSeq not in (Select mem2.memberSeq from Member mem2 JOIN mem2.reqFollower peer WHERE peer.memberSeq = :mySeq) and mem.memberSeq not in (Select mem2.memberSeq from Member mem2 JOIN mem2.following peer WHERE peer.memberSeq = :mySeq) and mem.memberSeq not in (Select mem2.memberSeq from Member mem2 JOIN mem2.follower peer WHERE peer.memberSeq = :mySeq)")
   ArrayList<Member> findValidPeerCand(@Param("mySeq") Long mySeq, @Param("searchParam") String searchParam);


    /*
    @SqlResultSetMapping(
    name="studentPercentile",
    classes={
        @ConstructorResult(
            targetClass=CustomStudent.class,
            columns={
                @ColumnResult(name="ID"),
                @ColumnResult(name="FIRST_NAME"),
                @ColumnResult(name="LAST_NAME")
            }
        )
    }
)

@NamedNativeQuery(name="findStudentPercentile", query="SELECT * FROM STUDENT", resultSetMapping="studentPercentile")

    * */
    //@Query("SELECT mem.memberSeq, mem.nickname, mem.userId, mem.lng, mem.lat FROM Member mem JOIN mem.follower peer WHERE peer.memberSeq = ?1")
    //@NamedNativeQuery(name="findAllFollow", query="SELECT mem.memberSeq, mem.nickname, mem.userId, mem.lng, mem.lat FROM Member mem JOIN mem.follower peer WHERE peer.memberSeq = ?1", resultClass = "Member")
        //This is using a named query method

    @Query("SELECT new com.kinggowarts.member.models.Member(mem.memberSeq, mem.nickname, mem.name, mem.profileImgPath, mem.lng, mem.lat) FROM Member mem JOIN mem.follower peer WHERE peer.memberSeq = ?1")
  // @Query("SELECT mem.memberSeq, mem.nickname, mem.userId, mem.lng, mem.lat FROM Member mem JOIN mem.follower peer WHERE peer.memberSeq = ?1")
    ArrayList<Member> findAllFollow(Long memberSeq);
    //@NamedNativeQuery(name="findStudentPercentile", query="SELECT * FROM STUDENT", resultSetMapping="studentPercentile")


    @Modifying
    @Query(value = "delete from req_peer where (req_from_seq =:fromSeq and req_to_seq =:toSeq) or (req_from_seq =:toSeq and req_to_seq =:fromSeq)", nativeQuery = true)
    void deleteReqPeer(@Param("fromSeq") Long fromSeq, @Param("toSeq") Long toSeq);

    @Modifying
    @Query(value = "insert into peer values(:fromSeq, :toSeq)", nativeQuery = true)
    void insertPeer(@Param("fromSeq") Long fromSeq, @Param("toSeq") Long toSeq);

    @Modifying
    @Query(value = "delete from peer where (from_seq =:fromSeq and to_seq =:toSeq) or (from_seq =:toSeq and to_seq =:fromSeq)", nativeQuery = true)
    void deletePeer(@Param("fromSeq") Long fromSeq, @Param("toSeq") Long toSeq);
}