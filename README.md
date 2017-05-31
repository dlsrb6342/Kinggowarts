## 배포파일

#### 1. 주소
https://drive.google.com/drive/folders/0B7qbRQX6_VNxd0NabjNpSXAzRHc?usp=sharing


#### 2. 실행방법
1. cmd 창에서 tomcat/bin/startup.bat 실행
2. locathost:8082/kinggowarts 접속

#### 3. 기타
* 포트번호 변경은 tomcat/conf/server.xml 의 8082 라 되어있는 부분을 바꾸면 됨
* 캐싱 옵션을 끄기 위해서는 tomcat/conf/context.xml 파일의 context 태그를 다음과 같이 수정해준다.(static 파일만 해당)
```xml
<Context cacheMaxSize="0" cacheTTL="0" cachingAllowed="false"/>
```

## RESTful API 명세

#### 1. 로그인
* 주소: /api/auth/login
* HTTP Method: POST
* Description: 로그인 요청
* Request Type: form data
* Request Value
 ```
  username: 유저 아이디(이메일)   
  password: 비밀번호
```

* Response Types: JSON

* Response Value:
```JSmin
{
  "userId": "protos1000@naver.com", /*유저 아이디*/
  "memberSeq": 1, /*유저 개인키*/
  "authorities": [
    {
      "authority": "ROLE_GUEST"
    },
    {
      "authority": "ROLE_STUDENT"
    }
  ], /*권한정보(교수가 없으면 의미없음)*/
  "token": "82b86409-50bb-4b82-b4eb-abf28b2dd04a", /*인증토큰*/
  "nickname": "haha", /*유저 닉네임*/
  "type": "S" /*회원 종류 (역시나 교수가 없으면 의미없음)*/
}
```

* Status codes
```
400: 잘못된 요청 (요청 타입이 잘못되었다거나 요청한 파라미터가 없다거나)
```
* Comment
```위에서 받아온 토큰은 로그인 이후에 rest 통신때 보내는 request의 header에
x-auth-token 값으로 token 값을 넣어주면 인증이 된다. 
ex) req.setRequestHeader('x-auth-token', token/*토큰값*/);
```
#### 2. 회원가입
* 주소: /api/member/signup
* HTTP Method: POST
* Description: 회원가입 요청
* Request Type: form data
* Request Value
```
userId: 이메일 주소
passWd: 패스워드
nickname: 닉네임
type: 회원 타입(S: 학생 T: 교수)
```

* Response Types: text
* Response Value
```
success: 성공적인 요청
duplicateId: 아이디 겹침
duplicateNickName: 닉네임 겹침
```
* Status codes
```
400: 잘못된 요청 (요청 타입이 잘못되었다거나 요청한 파라미터가 없다거나)
```
* Comment
```
회원가입 완료후에 사용자 이메일로 회원가입 요청 이메일이 간다. 거기에 있는 링크를 누르면 회원가입요청이 완료된다.
```
* TODO: 프로필 사진은 아직 미구현

#### 3. 지도 구역
* 주소: /api/map
* HTTP Method: POST
* Description: 지도 구역 추가 요청
* Request Type: form data
* Request Value
```
name : 구역이름
center : 구역 중심 좌표
shape : 구역 형태
path : 구역을 이루는 좌표
detail : 구역 상세 설명
```

* Response Types: text
* Response Value
```
success: 성공적인 요청
duplicatedName : 구역 이름 겹침
```
* Status codes
```
400: 잘못된 요청 (요청 타입이 잘못되었다거나 요청한 파라미터가 없다거나)
```