package com.kinggowarts.authentication;

import com.kinggowarts.member.MemberRepository;
import com.kinggowarts.member.models.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AuthenticationService implements UserDetailsService{

    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private MemberRepository memberRepository;

    @Override
    public UserAuth loadUserByUsername(String username) throws UsernameNotFoundException {
        Member member = null;
        if (username != null && !"".equals(username))
            member = memberRepository.findFirstByUserId(username);
        if (member == null) throw new UsernameNotFoundException("접속자 정보를 찾을 수 없습니다.");
        List<GrantedAuthority> roleList=new ArrayList<GrantedAuthority>();
        roleList.add(new SimpleGrantedAuthority("ROLE_GUEST"));
        if(member.getType()=='S')
            roleList.add(new SimpleGrantedAuthority("ROLE_STUDENT"));
        else if(member.getType()=='T')
            roleList.add(new SimpleGrantedAuthority("ROLE_TEACHER"));
        UserAuth user = new UserAuth(username, member.getPassWd(), roleList);
        user.setMemSeq(member.getMemberSeq());
        user.setConfirm(member.getConfirm());
        user.setNickname(member.getNickname());
        user.setType(member.getType());
        return user;
    }

    public PasswordEncoder getPasswordEncoder(){
        return this.passwordEncoder;
    }
}
