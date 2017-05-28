package com.kinggowarts.notice;

import com.kinggowarts.notice.models.Notice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController @RequestMapping("/api/notice")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    @RequestMapping(value="", method=RequestMethod.GET)
    public Page<Notice> findAll(@RequestParam(value="category", required=false) String category,
                                @PageableDefault(sort={ "id" }, direction= Sort.Direction.DESC) Pageable pageable){
        if(category instanceof String){
            return noticeService.findAllByCategory(category, pageable);
        }
        return noticeService.findAll(pageable);
    }

    @RequestMapping(value="/{id}", method=RequestMethod.GET)
    public Notice findById(@PathVariable("id") long id){
        return noticeService.findById(id);
    }
}