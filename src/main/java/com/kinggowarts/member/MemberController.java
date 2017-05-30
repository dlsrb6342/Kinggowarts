package com.kinggowarts.member;

import com.kinggowarts.member.models.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/member")
public class MemberController {
    @Autowired
    MemberService memberService;

    @PostMapping(value = "/signup")
    public String signUp(@ModelAttribute("member") Member member, HttpServletRequest req) {
        String url = req.getRequestURL().toString();
        int end  = url.indexOf("/api");
        return memberService.insertMember(member, url.substring(0, end));
    }


}
