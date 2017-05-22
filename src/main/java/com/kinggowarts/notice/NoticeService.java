package com.kinggowarts.notice;

import com.kinggowarts.notice.models.Notice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeService {
    @Autowired
    private NoticeRepository noticeDao;

    List<Notice> findAll(){
        return noticeDao.findAllByOrderByTimeDesc();
    }
}
