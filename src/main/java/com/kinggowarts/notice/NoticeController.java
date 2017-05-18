package com.kinggowarts.notice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/api/notice/")
public class NoticeController {
    @Autowired
    private NoticeRepository noticeDao;

    @ResponseBody @RequestMapping(value="",method=RequestMethod.GET)
    public List<Notice> noticeList(){
        return noticeDao.findAllByOrderByTime();
    }
}