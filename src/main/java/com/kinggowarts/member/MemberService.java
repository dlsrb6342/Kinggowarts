package com.kinggowarts.member;

import com.kinggowarts.member.models.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberService {
    @Autowired
    MemberRepository memberRepository;
    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();



    @Transactional
    public String insertMember(Member member){
        member.setPassWd(passwordEncoder.encode(member.getPassWd()) );
        if(memberRepository.findFirstByUserId(member.getUserId()) != null) {

            return "duplicateId";
        }else if(memberRepository.findFirstByNickname(member.getNickname()) != null){

            return "duplicateNickname";
        }else {
            //member.setConfirm(Member.NOT_CONFIRM);
            //TO-DO Email인증 구현
            member.setConfirm(Member.COMPLETE_CONFIRM);
            memberRepository.save(member);
            return "success";
        }

    }

}
