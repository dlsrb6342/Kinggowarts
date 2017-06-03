package com.kinggowarts.member;

import com.kinggowarts.authentication.UserAuth;
import com.kinggowarts.member.models.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import javax.validation.executable.ValidateOnExecution;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.Set;

@RestController
@RequestMapping("/api/member")
public class MemberController {
    @Autowired
    MemberService memberService;

    @PostMapping(value = "/signup")
    public String signUp(/*@Valid*/ Member member, /*BindingResult bindingResult,*/ HttpServletRequest req) {
       /* System.out.println(bindingResult.hasErrors());
        System.out.println(bindingResult.getAllErrors().isEmpty());
        System.out.println(member.toString());
        if(bindingResult.hasErrors())
            if(!bindingResult.getAllErrors().isEmpty())
                return bindingResult.getAllErrors().get(0).getDefaultMessage();
            else
                return "validation error";*/
        String url = req.getRequestURL().toString();
        int end  = url.indexOf("/api");
        return memberService.insertMember(member, url.substring(0, end));
    }

    //친추 보낸 목록
    @GetMapping(value = "/reqPeerFromMe")
    public ArrayList<Member> getReqFollowingList() {
        UserAuth user = (UserAuth) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return memberService.getReqFollowingList(user.getMemSeq());
    }

    //친추 받은 목록
    @GetMapping(value = "/reqPeerToMe")
    public ArrayList<Member> getReqFollowerList() {
        UserAuth user = (UserAuth) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return memberService.getReqFollowerList(user.getMemSeq());
    }

    //친구 요청 보내기
    @PostMapping(value = "/reqPeerFromMe")
    public void sendReqFollower(@RequestParam Long toSeq) {
        UserAuth user = (UserAuth) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        memberService.sendReqFollowing(user.getMemSeq(), toSeq);
    }

    //친구 수락 Or 거절
    @PostMapping(value = "/reqPeerToMe")
    public void decideReqFollower(@RequestParam Long toSeq, @RequestParam String type) {
        UserAuth user = (UserAuth) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        memberService.decideReqFollower(user.getMemSeq(), toSeq, type);
    }

    //친구 삭제
    @DeleteMapping(value = "/peer")
    public void deleteFollow(@RequestParam Long toSeq) {
        UserAuth user = (UserAuth) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        memberService.deleteFollow(user.getMemSeq(), toSeq);
    }

    //친구 목록
    @GetMapping(value = "/peer")
    public ArrayList<Member> getFollow() {
        UserAuth user = (UserAuth) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return memberService.getFollow(user.getMemSeq());
    }

    @PatchMapping(value = "/coordinate")
    public ArrayList<Member> updateCoordinate(@RequestBody  Member member){
        UserAuth user = (UserAuth) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        memberService.updateCoordinate(user.getMemSeq(), member.getLng(), member.getLat());
        return memberService.getPeerList(user.getMemSeq());
    }

}
