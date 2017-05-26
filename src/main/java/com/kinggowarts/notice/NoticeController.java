package com.kinggowarts.notice;

import com.kinggowarts.notice.models.Notice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController @RequestMapping("/api/notice")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    @RequestMapping(value="", method=RequestMethod.GET)
    public List<Notice> findAll(HttpServletRequest request){
        String category = request.getParameter("category");
        if(category instanceof String){
            return noticeService.findAllByCategory(category);
        }
        return noticeService.findAll();
    }

    @RequestMapping(value="/{id}", method=RequestMethod.GET)
    public Notice findById(@PathVariable("id") long id){
        return noticeService.findById(id);
    }
}