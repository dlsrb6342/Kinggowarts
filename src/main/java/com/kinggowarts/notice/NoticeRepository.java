package com.kinggowarts.notice;

import com.kinggowarts.notice.models.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    Page<Notice> findAllByOrderByTimeDesc(Pageable pageable);
    Page<Notice> findAllByCategory_Name(String category, Pageable pageable);
}
