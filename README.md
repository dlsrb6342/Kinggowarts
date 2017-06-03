## 배포파일

#### 1. 주소
https://drive.google.com/drive/folders/0B7qbRQX6_VNxd0NabjNpSXAzRHc?usp=sharing


#### 2. 실행방법
1. cmd 창에서 tomcat/bin/startup.bat 실행
2. locathost:8082/kinggowarts 접속

#### 3. 새로운 배포파일로 바꾸기
1. 위 링크에서 최신의 배포파일을 받는다. (kinggowartsXXXX_X.zip)
2. 압축을 풀면 kinggowarts.war가 나온다.
3. tomcat/webapps 에서 kinggowarts 폴더와 kinggowarts.war를 지운다.
4. 새로운 kinggowarts.war를 tomcat/webapps 에 넣어준다.
5. 톰캣 실행

#### 4. 로컬 Xwiki
```
로컬 톰캣에는 로컬 XWiki 또한 포함되어있다. 이는 운영(fanatic1.~)의 XWiki와 동일한 DB이지만 로컬서버에서 돌아간다.

로컬주소/xwiki 로 들어가면 로컬의 XWiki가 초기화된다. 서버 재시작을 할때 한번 들어가서 XWiki를 초기화 해줘야 한다.

이를 통해 로컬서버에서도 XWiki 로그인을 및 접속이 가능하다.(로컬 XWiki를 이용하지 않으면 CORS문제가 생긴다.)
```

#### 5. 기타
* 포트번호 변경은 tomcat/conf/server.xml 의 8082 라 되어있는 부분을 바꾸면 됨
* 캐싱 옵션을 끄기 위해서는 tomcat/conf/context.xml 파일의 context 태그를 다음과 같이 수정해준다.(static 파일만 해당)
```xml
<Context cacheMaxSize="0" cacheTTL="0" cachingAllowed="false"/>
```
## 프론트엔드

#### 1. 실행방법
1. 위의 배포파일의 경우 톰캣을 실행한 후 생성되는 tomcat/webapps/kinggowarts/WEB-INF/classes/static으로, github 경로는 Kinggowarts/src/main/resources/static로 간다.
2. npm install을 입력하여 gulp api들을 받는다.
3. static/src경로로 이동, gulp install을 입력하여 bower_components로 필요한 프론트엔드 api를 받는다.
4. gulpfile.js가 있는 static 경로로 다시 이동하여 gulp watch를 입력한다. (js나 css가 변화될 경우 자동으로 inject한다.)

#### 2. Api 설치 방법
```
npm install --save로 설치되는 api들은 모두 nodejs 모듈이기 때문에 우리는 gulp를 실행할때만 사용한다.
따라서 bower install --save를 이용하여 bower 모듈로써 설치해야 한다. 
이 때, --save를 입력하면 설치한 모듈이 자동으로 최신버젼 기준으로 bower.json에 기록되어 다른 사람들은 bower install만 입력하면 된다. 
물론 이 때 bower.json이 있는 경로에서 bower install --save를 입력해야 한다.
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
#### 2. XWiki 로그인
* REST 요청은 아님
* XWiki로 basic authentication와 함게 요청을 보내면 쿠키를 가져와서 XWiki 로그인 상태를 유지할 수 있음.
* XWiki의 아이디로는 닉네임을 쓰고 패스워드는 동일.
* 예시
```javascript
var xhr = new XMLHttpRequest();
//이런식으로 주소가 현재 호스트를 반영하도록 함
xhr.open("GET", location.protocol+"//"+location.host+"/xwiki/bin/view/Main/", true);
xhr.withCredentials = true;
xhr.setRequestHeader("Authorization", 'Basic ' + btoa('아이디:패스워드'));
xhr.send();
```


#### 3. 회원가입
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
회원가입 요청링크로 이동한 뒤 로그인을 시도하면(첫 로그인) 이때 Xwiki 회원가입이 자동으로 완료된다.
따라서 Xwiki로그인은 Kinggowarts 로그인을 마친 뒤에 callback으로 해야함.
```
* TODO: 프로필 사진은 아직 미구현

#### 4. 지도 구역 추가
* 주소: /api/map
* HTTP Method: POST
* Description: 지도 구역 추가 요청
* Request Type: application/json
* Request Value

```
name: 구역이름
center: { lat : , lng : }
shape: 구역 형태
path: [ { lat : , lng : }, { lat : , lng : } ... ]
detail: 구역 상세 설명
tag: [ { name : }, { name : } ... ]
```

* Response Types: text
* Response Value
```
success: 성공적인 요청
duplicatedName: 구역 이름 겹침
```

#### 5. 지도 구역 수정
* 주소: /api/map/{id}
* HTTP Method: PUT
* Description: 지도 구역 수정 요청
* Request Type: application/json
* Request Value

```
name: 구역이름
center: { lat : , lng : }
shape: 구역 형태
path: [ { lat : , lng : }, { lat : , lng : } ... ]
detail: 구역 상세 설명
tag: [ { name : }, { name : } ... ]
```

* Response Types: text
* Response Value
```
success: 성공적인 요청
noLocation: 구역 정보 없음
```

#### 6. 지도 구역 삭제
* 주소: /api/map/{id}
* HTTP Method: DELETE
* Description: 지도 구역 삭제 요청

* Response Types: text
* Response Value
```
success: 성공적인 요청
noLocation: 구역 정보 없음
```

#### 7. 이벤트 추가
* 주소: /api/event
* HTTP Method: POST
* Description: 이벤트 추가 요청
* Request Type: application/json
* Request Value
```
l_id: 구역 고유 번호
title: 이벤트 타이틀
about: 이벤트 상세 설명
creator: { memberSeq: 사용자 고유 번호 }
tag: [ { name : }, { name : } ... ]
fromDate: 이벤트 시작 날짜(Timestamp)
toDate: 이벤트 종료 날짜(Timestamp)
```

* Response Types: text
* Response Value
```
success: 성공적인 요청
noMember: 사용자 정보 없음
```

#### 8. 이벤트 수정
* 주소: /api/event/{id}
* HTTP Method: PUT
* Description: 이벤트 수정 요청
* Request Type: application/json
* Request Value
```
l_id: 구역 고유 번호
title: 이벤트 타이틀
about: 이벤트 상세 설명
creator: { memberSeq: 사용자 고유 번호 }
tag: [ { name : }, { name : } ... ]
fromDate: 이벤트 시작 날짜(Timestamp)
toDate: 이벤트 종료 날짜(Timestamp)
```

* Response Types: text
* Response Value
```
success: 성공적인 요청
noEvent: 이벤트 정보 없음
noMember: 사용자 정보 없음
```

#### 9. 이벤트 삭제
* 주소: /api/map/{id}
* HTTP Method: DELETE
* Description: 이벤트 삭제 요청

* Response Types: text
* Response Value
```
success: 성공적인 요청
noEvent: 이벤트 정보 없음
```