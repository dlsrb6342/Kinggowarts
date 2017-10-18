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

        vm.isdisabled = false;
        vm.surl = 'assets/images/backgrounds/skku_y.jpg';


        /* 초기화 */
        $rootScope.$broadcast('msSplashScreen::remove'); // 로딩창 비활성화

        if($stateParams.auth == 'true'){ // 인증토큰을 통한 접근이 성공했을 경우 alert 띄움
            alert('인증이 완료되었습니다.');
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
                        $state.go('app.main.map');

                    }, function errorCallback(response) 
                    {
                        vm.isdisabled = false;
                        alert('위키 로그인에 실패하였습니다.');
                    });
                    
                }, function errorCallback(response) {
                    vm.isdisabled = false;
                    alert('아이디나 비밀번호를 확인해주세요.');
                });
            }
            
        };

        vm.bgChanger = function ()
        {
            if (vm.surl == 'assets/images/backgrounds/skku_y.jpg')
            {
                vm.surl = 'assets/images/backgrounds/skku_m.JPG';
            }
            else
            {
                vm.surl = 'assets/images/backgrounds/skku_y.jpg';
            }
        }

        $interval(vm.bgChanger, 10000);



    }
})();
