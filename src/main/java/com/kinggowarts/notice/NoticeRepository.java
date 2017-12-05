package com.kinggowarts.notice;

import com.kinggowarts.notice.models.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long>{
    NoticeProjection findById(Long id);
    List<NoticeProjection> findByPage_IdIn(ArrayList<Long> pages);
    List<NoticeProjection> findTop30ByCategory_IdOrPage_IdIn(Long id, ArrayList<Long> pages);
    List<NoticeProjection> findByCategory_IdAndPageIsNull(Long id);
}
