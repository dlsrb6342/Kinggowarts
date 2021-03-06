/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/login/login.controller.js
*  Author     : underkoo
*  Description: login 컨트롤러
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    /** @ngInject */

    function LoginController(
        /* 모듈 */
        $document,
        $http, 
        $httpParamSerializerJQLike,
        $rootScope,
        $state, 
        $stateParams, 
        $sessionStorage,
        $interval)
    {
        /* Data */
        var vm = this;

        /* 초기화 */
        vm.isdisabled = false;
        vm.bgf = true;
        vm.isM = false;
        vm.surly = 'assets/images/backgrounds/skku_y.jpg';
        vm.surlm = 'assets/images/backgrounds/skku_m2.JPG';
        vm.loginformclass = "md-whiteframe-8dp"

        /* 초기화 */
        $rootScope.$broadcast('msSplashScreen::remove'); // 로딩창 비활성화

        if($stateParams.auth == 'true'){ // 인증토큰을 통한 접근이 성공했을 경우 alert 띄움
            alert('인증이 완료되었습니다.');
        }

        if($rootScope.isMobile == true)
        {
            vm.isM = true;
            vm.loginformclass = ""
        }

        /* Methods */
        /**********************************************************************//**
        로그인 버튼 클릭했을 때 정보 전송하고 세션스토리지에 등록. */
        vm.loginfun = function (email,password) 
        {
            if (vm.isdisabled == false){
                vm.isdisabled = true;
                
                /* 클라이언트 로그인 */
                $http({
                    method : 'POST',
                    url : './api/auth/login',
                    data : $httpParamSerializerJQLike({
                        username : email,
                        password : password
                    }),
                    headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
                }).then(function successCallback(
                    response)
                {
                    /* 클라이언트 로그인 성공 이후 세션스토리지에 관련 정보 등록 */
                    $sessionStorage.put('nickname', response.data.nickname, 50);
                    $sessionStorage.put('memberSeq', response.data.memberSeq, 50);
                    $sessionStorage.put('useremail', response.data.userId, 50);
                    $sessionStorage.put('AuthToken', response.data.token, 50);
                    $sessionStorage.put('profileImgPath', response.data.profileImgPath, 50);
                    $sessionStorage.put('username', response.data.name, 50);

                    var nickname = response.data.nickname;

                    /* xwiki 로그인 */
                    $http({
                        method : 'GET',
                        url : '../xwiki/bin/login/',
                        withCredentials: true,
                        headers:{'Authorization' : 'Basic ' + btoa(nickname+":"+password)}
                    }).then(function successCallback(response)
                    {
                        console.log(response);
                        $state.go('app.main.map');

                    }, function errorCallback(response) 
                    {
                        console.log(response);
                        vm.isdisabled = false;
                        alert('위키 로그인에 실패하였습니다.');
                    });
                    
                }, function errorCallback(response) {
                    console.log(response);
                    vm.isdisabled = false;
                    alert('아이디나 비밀번호를 확인해주세요.');
                });
            }
            
        };
        /*bgf 값을 변경하여 배경 이미지 교체 */
        vm.bgChanger = function ()
        {
            vm.bgf = !vm.bgf;
        }

        $interval(vm.bgChanger, 10000);



    }
})();
