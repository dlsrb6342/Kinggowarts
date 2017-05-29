package com.kinggowarts.member;

import com.kinggowarts.member.models.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/member")
public class MemberController {
    @Autowired
    MemberService memberService;

    @PostMapping(value = "/signup")
    public String signUp(@ModelAttribute("member") Member member) {
        return memberService.insertMember(member);
    }


}
