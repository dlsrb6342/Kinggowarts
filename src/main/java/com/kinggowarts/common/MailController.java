package com.kinggowarts.common;

import com.kinggowarts.member.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.security.access.AccessDeniedException;

@Controller
public class MailController {
    @Autowired
    MemberService memberService;

    @RequestMapping(value = "/api/mail/active")
    public String activeAccount(@RequestParam String code) throws Exception{
        if(memberService.activeUser(code))
            return "redirect:/login?auth=true";
        else{
            throw  new AccessDeniedException("403 returned");
        }
    }
}
