package com.kinggowarts.notice;

import com.kinggowarts.notice.models.Notice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeService {
    @Autowired
    private NoticeRepository noticeDao;

    Page<Notice> findAll(Pageable pageable){
        return noticeDao.findAll(pageable);
    }

    Notice findById(long id) {
        return noticeDao.findOne(id);
    }

    Page<Notice> findAllByCategory(String category, Pageable pageable){
        return noticeDao.findAllByCategory_Name(category, pageable);
    }
}
