package com.kinggowarts.notice;

import com.kinggowarts.notice.models.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findAllByOrderByTimeDesc();
}
