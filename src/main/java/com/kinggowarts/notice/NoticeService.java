package com.kinggowarts.notice;

import com.kinggowarts.notice.models.Notice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class NoticeService {
    @Autowired
    private NoticeRepository noticeDao;
    @Autowired
    private NoticeSearchRepository noticeSearchDao;

    Page<Notice> findAll(Pageable pageable){
        return noticeDao.findAll(pageable);
    }
    List<Notice> findAll() {
        return noticeDao.findAllByOrderByIdDesc();
    }

    Notice findById(long id) {
        return noticeDao.findOne(id);
    }

    Page<Notice> findAllByCategory(String category, Pageable pageable){
        return noticeDao.findAllByCategory_Name(category, pageable);
    }
    List<Notice> findAllByCategory(String category){
        return noticeDao.findAllByCategory_Name(category);
    }

    List<Notice> searchNotice(String q){
        return noticeSearchDao.findAllByContentsContainsOrTitleContains(q);
    }
}
