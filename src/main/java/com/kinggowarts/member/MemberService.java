package com.kinggowarts.member;

import com.kinggowarts.common.MailService;
import com.kinggowarts.common.utils.EncryptString;
import com.kinggowarts.member.models.Member;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.internal.constraintvalidators.hv.EmailValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.mail.internet.InternetAddress;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class MemberService {
    @Autowired
    MemberRepository memberRepository;

    @Autowired
    MailService mailService;

    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    EncryptString encryptString;


    @Transactional
    public String insertMember(Member member, String url){
        member.setPassWd(passwordEncoder.encode(member.getPassWd()) );
        if(memberRepository.findFirstByUserId(member.getUserId()) != null) {

            return "duplicateId";
        }else if(memberRepository.findFirstByNickname(member.getNickname()) != null){

            return "duplicateNickname";
        }else {
            member.setConfirm(Member.NOT_CONFIRM);
            //TO-DO Email인증 구현
            //member.setConfirm(Member.COMPLETE_CONFIRM);
            mailService.sendMailAuth(member.getUserId(), url);

            memberRepository.save(member);
            return "success";
        }
    }

    private static boolean isValidEmail(String email) {
        boolean err = false;
        String regex = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
                + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
        Pattern p = Pattern.compile(regex);
        Matcher m = p.matcher(email);
        if(m.matches()) {
            err = true;
        }
        return err;
    }

    @Transactional
    public boolean activeUser(String code){
        String userId = encryptString.decrypt(code);
        if(isValidEmail(userId)) {
            Member member = memberRepository.findFirstByUserId(userId);
            member.setConfirm(Member.COMPLETE_CONFIRM);
            memberRepository.save(member);
            return true;
        }else
            return false;

    }

}
