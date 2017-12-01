package com.kinggowarts.notice;

import com.kinggowarts.authentication.UserAuth;
import com.kinggowarts.notice.models.Notice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController @RequestMapping("/api/notice")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;


    @GetMapping("")
    public Object findByFavorite(@RequestParam(value="all") String all,
                          @PageableDefault(sort={ "id" }, direction= Sort.Direction.DESC) Pageable pageable){
        UserAuth user = (UserAuth) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(all.equals("true")){
            return noticeService.findByFavorite(user.getMemSeq());
        } else {
            return noticeService.findByFavorite(user.getMemSeq(), pageable);
        }
    }

    @GetMapping("/category")
    public List<CategoryProjection> findAll() {
        return noticeService.findAllCategory();
    }

    @GetMapping("/{id}")
    public NoticeProjection findById(@PathVariable("id") long id){
        return noticeService.findById(id);
    }

    @GetMapping("/search")
    public List<Notice> searchNotice(@RequestParam("q") String q){
        return noticeService.searchNotice(q);
    }

}