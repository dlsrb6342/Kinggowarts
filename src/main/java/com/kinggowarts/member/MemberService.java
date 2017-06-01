package com.kinggowarts.member;

import com.kinggowarts.authentication.UserAuth;
import com.kinggowarts.common.MailService;
import com.kinggowarts.common.utils.EncryptString;
import com.kinggowarts.member.models.Member;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
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

    @Value("${spring.wikiUri}")
    String wikiUri;

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
            member.setConfirm(Member.EMAIL_CONFIRM);
            memberRepository.save(member);
            //signUpXwiki(member.getNickname());
            return true;
        }else
            return false;

    }

    @Transactional
    public void confirmUser(String userId, String userPw){
        Member member = memberRepository.findFirstByUserId(userId);
        member.setConfirm(Member.COMPLETE_CONFIRM);
        memberRepository.save(member);
        signUpXwiki(member.getNickname(), userPw);

    }


    public void signUpXwiki(String nickname, String userPw) {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
                .getRequestAttributes()).getRequest();
        try {
            CloseableHttpClient httpclient = HttpClients.createDefault();
            System.out.println(wikiUri+"/bin/register/XWiki/XWikiRegister");
            HttpPost httpPost = new HttpPost(wikiUri+"/bin/register/XWiki/XWikiRegister");
            //전달하고자 하는 PARAMETER를 List객체에 담는다
            httpPost.setHeader("Content-Type", "application/x-www-form-urlencoded");
            List<NameValuePair> nvps = new ArrayList<NameValuePair>();
            nvps.add(new BasicNameValuePair("register_first_name", ""));
            nvps.add(new BasicNameValuePair("register_last_name", ""));
            nvps.add(new BasicNameValuePair("register_email", ""));
            nvps.add(new BasicNameValuePair("register_password", userPw));
            nvps.add(new BasicNameValuePair("register2_password", userPw));
            nvps.add(new BasicNameValuePair("xwikiname", nickname));
            //UTF-8은 한글
            httpPost.setEntity(new UrlEncodedFormEntity(nvps, "UTF-8"));
            CloseableHttpResponse response = httpclient.execute(httpPost);
            try {
               // System.out.println(response.getStatusLine());
                //API서버로부터 받은 JSON 문자열 데이터
                //System.out.println(EntityUtils.toString(response.getEntity()));
                //HttpEntity entity = response.getEntity();
                //EntityUtils.consume(entity);
            } finally {
                response.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
