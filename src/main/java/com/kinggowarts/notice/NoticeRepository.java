package com.kinggowarts.notice;

import com.kinggowarts.notice.models.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long>{
    NoticeProjection findById(Long id);
    List<NoticeProjection> findByPage_Id(Long id);
    List<NoticeProjection> findByCategory_Id(Long id);
}
