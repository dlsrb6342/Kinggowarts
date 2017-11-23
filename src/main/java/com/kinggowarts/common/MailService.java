package com.kinggowarts.common;

import com.kinggowarts.common.utils.EncryptString;
import org.apache.catalina.util.URLEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriUtils;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.File;

@Service
public class MailService {
    // org.springframework.mail.javamail.JavaMailSender
    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    Environment env;

    @Autowired
    EncryptString encryptString;


    public void send(String subject, String text, String from, String to, String filePath) {
        // javax.mail.internet.MimeMessage
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            System.out.println(subject);
            System.out.println(text);
            System.out.println(from);
            System.out.println(to);
            // org.springframework.mail.javamail.MimeMessageHelper
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setSubject(subject);
            helper.setText(text, true);
            helper.setFrom(from);
            helper.setTo(to);

            // 첨부 파일 처리
            if (filePath != null) {
                File file = new File(filePath);
                if (file.exists()) {
                    helper.addAttachment(file.getName(), new File(filePath));
                }
            }

            javaMailSender.send(message);
           // return true;
        } catch (MessagingException e) {
            e.printStackTrace();
        }
      //  return false;
    }
    @Async
    public void sendMailAuth(String email, String url) {
       // int ran = new Random().nextInt(100000000) + 10000; // 10000 ~ 99999
       // String joinCode = String.valueOf(ran);
        try {
            String subject = "Kinggowarts 회원가입을 완료해 주세요.";
            StringBuilder sb = new StringBuilder();
            sb.append("<a href=\"" + url + "/api/mail/active?code=" + UriUtils.encodeQueryParam(encryptString.encrypt(email), "UTF-8") + "\">인증하기</a>");
            send(subject, sb.toString(), env.getProperty("spring.mail.username"), email, null);
        }catch (Exception e){

        }
    }

    @Async
    public void sendNewPassword(String email, String newPassword) {
        try {
            String subject = "비밀번호 재발급 메일입니다.";
            StringBuilder sb = new StringBuilder();
            sb.append("<p>새로운 비밀번호입니다. 로그인 후 비밀번호를 변경해주세요.<br>" +
                    newPassword + "</p>");
            send(subject, sb.toString(), env.getProperty("spring.mail.username"), email, null);
        }catch (Exception e){

        }
    }
}