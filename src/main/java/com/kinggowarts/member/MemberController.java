package com.kinggowarts.member;

import com.kinggowarts.authentication.UserAuth;
import com.kinggowarts.member.models.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/member")
public class MemberController {
    @Autowired
    private MemberService memberService;

    @PostMapping(value = "/signup")
    public String signUp(@Valid Member member, BindingResult bindingResult, HttpServletRequest req) {
        if(bindingResult.hasErrors())
            if(!bindingResult.getAllErrors().isEmpty())
                return bindingResult.getAllErrors().get(0).getDefaultMessage();
            else
                return "validation error";
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

    @GetMapping(value = "/search")
    public ArrayList<Member> searchMember(@RequestParam String q) {
        UserAuth user = (UserAuth) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return memberService.searchMember(user.getMemSeq(), q);
    }

    @GetMapping(value = "/{memberSeq}")
    public Member test(@PathVariable Long memberSeq){
        return memberService.getMemberBySeq(memberSeq);
    }

    @PostMapping(value ="/profileImg")
    public String updateProfileImg(@RequestParam("file") MultipartFile file){
        UserAuth user = (UserAuth) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return memberService.setProfileImg(user.getMemSeq(), file);
    }

    @PostMapping(value = "/changePassword")
    public String changePassword(String newPassword,  String lastPassword) {
        UserAuth user = (UserAuth) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return memberService.changePassword(user.getMemSeq(), newPassword, lastPassword);
    }

    @PostMapping(value = "/findPassword")
    public String findPassword(String email, String name) {
        return memberService.findPassword(email, name);
    }

    @PutMapping(value = "/setAgreement")
    public String setAgreement(@RequestParam String b) {
        UserAuth user = (UserAuth) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Boolean agreement = Boolean.valueOf(b);
        return memberService.setAgreement(user.getMemSeq(), agreement);
    }

    @PostMapping(value = "/favorite")
    public String updateFavorite(@RequestBody Map<Long, ArrayList<Long>> body) {
        UserAuth user = (UserAuth) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return memberService.updateFavorite(user.getMemSeq(), body);
    }
}
