package com.kinggowarts.notice;

import com.kinggowarts.notice.models.Notice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @RequestMapping("/api/notice")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    @GetMapping("")
    public Object findAll(@RequestParam(value="category", required=false) String category,
                                @RequestParam(value="all") String all,
                                @PageableDefault(sort={ "id" }, direction= Sort.Direction.DESC) Pageable pageable){
        if(all.equals("true")){
            if(category != null){
                return noticeService.findAllByCategory(category);
            } else {
                return noticeService.findAll();
            }
        } else {
            if(category != null){
                return noticeService.findAllByCategory(category, pageable);
            } else {
                return noticeService.findAll(pageable);
            }
        }
    }

    @GetMapping("/{id}")
    public Notice findById(@PathVariable("id") long id){
        return noticeService.findById(id);
    }

    @GetMapping("/search")
    public List<Notice> searchNotice(@RequestParam("q") String q){
        return noticeService.searchNotice(q);
    }
}