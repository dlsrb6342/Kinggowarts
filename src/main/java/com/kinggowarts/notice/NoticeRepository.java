package com.kinggowarts.notice;

import com.kinggowarts.notice.models.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    Page<Notice> findAllByCategory_NameOrderByTimeDesc(String category, Pageable pageable);
    List<Notice> findAllByCategory_NameOrderByTimeDesc(String category);
    List<Notice> findAllByOrderByTimeDesc();
    Page<Notice> findAllByOrderByTimeDesc(Pageable pageable);
}
