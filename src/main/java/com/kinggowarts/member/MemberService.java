package com.kinggowarts.member;

import com.kinggowarts.common.FileService;
import com.kinggowarts.common.MailService;
import com.kinggowarts.common.utils.EncryptString;
import com.kinggowarts.member.models.Favorite;
import com.kinggowarts.member.models.Member;
import org.apache.commons.collections4.multimap.HashSetValuedHashMap;
import org.apache.http.NameValuePair;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
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
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class MemberService {
    @Autowired
    MemberRepository memberRepository;

    @Autowired
    FavoriteRepository favoriteRepository;

    @Autowired
    MailService mailService;

    PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    EncryptString encryptString;

    @Autowired
    FileService fileService;

    @Value("${spring.wikiUri}")
    String wikiUri;

    @Value("${spring.wiki.admin.id}")
    String wikiId;

    @Value("${spring.wiki.admin.pw}")
    String wikiPw;

    @Transactional
    public String insertMember(Member member, String url){
        member.setPassWd(passwordEncoder.encode(member.getPassWd()) );
        member.setProfileImgPath("");
        member.setLat(-1.0);
        member.setLng(-1.0);
        member.setAgreement(false);
        if(memberRepository.findFirstByUserId(member.getUserId()) != null) {

            return "duplicateId";
        }else if(memberRepository.findFirstByNickname(member.getNickname()) != null){

            return "duplicateNickname";
        }else if(member.getType() != 'M' || member.getType() != 'Y'){

            return "invalidType";
        }else {
            member.setConfirm(Member.NOT_CONFIRM);
            mailService.sendMailAuth(member.getUserId(), url);
            memberRepository.save(member);
            return "success";
        }
    }

    @Transactional
    public String changePassword(Long memSeq, String newPassWd, String lastPassWd){
        Member lastMember = getMemberBySeq(memSeq);
        if(!passwordEncoder.matches(lastPassWd, lastMember.getPassWd())){
            return "wrongPassword";
        }else if(newPassWd.length()<6 && newPassWd.length()>16){
            return "비밀번호는 6~16자까지 허용합니다.";
        }else {
            lastMember.setPassWd(passwordEncoder.encode(newPassWd));
            memberRepository.save(lastMember);
            changePasswordXwiki(lastMember.getNickname(), newPassWd);
            return "success";
        }
    }

    @Transactional
    public String findPassword(String email, String name) {
        System.out.println(email + " " + name);
        Member member = memberRepository.findFirstByUserId(email);
        if (member == null) {
            return "입력하신 내용을 다시 확인해주시기 바랍니다.";
        } else if(!member.getName().equals(name)) {
            return "입력하신 내용을 다시 확인해주시기 바랍니다.";
        } else {
            String newPassword = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 9);
            member.setPassWd(passwordEncoder.encode(newPassword));
            memberRepository.save(member);
            changePasswordXwiki(member.getNickname(), newPassword);
            mailService.sendNewPassword(email, newPassword);
            return "success";
        }
    }

    @Transactional
    public String setAgreement(Long memSeq, Boolean agreement) {
        Member member = getMemberBySeq(memSeq);
        if(member.getAgreement() ^ agreement) {
            member.setAgreement(agreement);
            memberRepository.save(member);
            return "success";
        } else {
            return "notChanged";
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

    public void changePasswordXwiki(String nickname, String userPw) {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder
                .getRequestAttributes()).getRequest();
        try {
            ///xwiki/bin/view/XWiki/user10?xpage=passwd
            HttpPost httpPost = new HttpPost(wikiUri+"/bin/view/XWiki/"+nickname+"?xpage=passwd");
            //전달하고자 하는 PARAMETER를 List객체에 담는다
            httpPost.setHeader("Content-Type", "application/x-www-form-urlencoded");
            String encoding = Base64.getEncoder().encodeToString((wikiId+":"+wikiPw).getBytes());//.encod (wikiId+":"+wikiPw);
            httpPost.setHeader("Authorization", "Basic " + encoding);


            CredentialsProvider provider = new BasicCredentialsProvider();
            UsernamePasswordCredentials credentials
                    = new UsernamePasswordCredentials(wikiId, wikiPw);
            provider.setCredentials(AuthScope.ANY, credentials);

            List<NameValuePair> nvps = new ArrayList<NameValuePair>();
            nvps.add(new BasicNameValuePair("password", userPw));
            nvps.add(new BasicNameValuePair("password2", userPw));
            //UTF-8은 한글
            httpPost.setEntity(new UrlEncodedFormEntity(nvps, "UTF-8"));
            //CloseableHttpClient httpclient = HttpClientBuilder.create().setDefaultCredentialsProvider(provider).build();
            CloseableHttpClient httpclient = HttpClients.createDefault();

            CloseableHttpResponse response = httpclient.execute(httpPost);
            try {
                System.out.println(response.getStatusLine());
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

    public Member getMemberBySeq(Long memberSeq){
        return memberRepository.findByMemberSeq(memberSeq);
    }

    @Transactional
    public void sendReqFollowing(Long fromUserSeq, Long toUserSeq){
        memberRepository.insertPeerReq(fromUserSeq, toUserSeq);
    }


    @Transactional
    public void decideReqFollower(Long fromUserSeq, Long toUserSeq, String type){
        memberRepository.deleteReqPeer(fromUserSeq, toUserSeq);
        if(type.equals("true")) {
            memberRepository.insertPeer(fromUserSeq, toUserSeq);
            memberRepository.insertPeer(toUserSeq, fromUserSeq);
        }

    }

    @Transactional
    public void deleteFollow(Long fromUserSeq, Long toUserSeq){
        memberRepository.deletePeer(fromUserSeq, toUserSeq);
    }

    public ArrayList<Member> getReqFollowingList(Long memSeq){
        return memberRepository.findAllRequestFromMe(memSeq);
    }

    public ArrayList<Member> getReqFollowerList(Long memSeq){
        return memberRepository.findAllRequestToMe(memSeq);
    }

    public ArrayList<Member> getFollow(Long memSeq){
        return memberRepository.findAllFollow(memSeq);
    }

    @Transactional
    public void updateCoordinate(Long memSeq, Double lng, Double lat){
        Member member = memberRepository.findByMemberSeq(memSeq);
        member.setLng(lng);
        member.setLat(lat);
        memberRepository.save(member);
    }

    public ArrayList<Member> getPeerList(Long memSeq){
        return memberRepository.findAllFollow(memSeq);
    }

    public ArrayList<Member> searchMember(Long memberSeq, String searchParam){
        return memberRepository.findValidPeerCand(memberSeq, searchParam);
    }


    @Transactional
    public String setProfileImg(Long memSeq, MultipartFile file){
        Member member = getMemberBySeq(memSeq);
        String message = fileService.writeFile(file, member.getNickname());
        for (String errorMsg : FileService.errorMessage) {
            if(errorMsg.equals(message)){
                return message;
            }
        }
        if(member.getProfileImgPath()!=null)
            fileService.deleteFile(member.getProfileImgPath());
        member.setProfileImgPath(message);
        return message;
    }

    @Transactional
    public String updateFavorite(Long memSeq, Map<Long, ArrayList<Long>> body){
        Member member = getMemberBySeq(memSeq);
        Set<Long> keySet = body.keySet();
        for(Long i : keySet) {
            Favorite favorite = new Favorite(member, i, body.get(i));
            favoriteRepository.save(favorite);
        }
        return "success";
    }
}
