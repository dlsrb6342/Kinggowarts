package com.kinggowarts.authentication;

import com.kinggowarts.member.MemberService;
import com.kinggowarts.member.models.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    MemberService memberService;

    @ResponseBody
    @PostMapping(value="/login")
    public Object login(
            @RequestParam(value="username") String name,
            @RequestParam(value="password") String pw,
            HttpSession session
    ) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(name, pw);
        Authentication authentication = authenticationManager.authenticate(token);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                SecurityContextHolder.getContext());
        UserAuth user = (UserAuth) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(user.getConfirm()==Member.EMAIL_CONFIRM){
            memberService.confirmUser(name, pw);
        }else if(user.getConfirm()!= Member.COMPLETE_CONFIRM)
            return "Not confirmed";
        Member mem = memberService.getMemberBySeq(user.getMemSeq());
        return new UserAuthToken(user.getUsername(), user.getAuthorities(), session.getId(), user.getNickname(), user.getMemSeq(), mem.getName(), mem.getProfileImgPath());
    }

}
