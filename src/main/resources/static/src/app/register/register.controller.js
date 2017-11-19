/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/register/register.controller.js
*  Author     : underkoo
*  Description: register 컨트롤러
*******************************************************/


(function ()
{
    'use strict';

    angular
        .module('app.register')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController(
      /* 모듈 */
      $document, 
      $http, 
      $httpParamSerializerJQLike, 
      $mdDialog, 
      $rootScope, 
      $state)
    {
        var vm = this;
     
        /* Data */
        vm.form = {};

        /* 초기화 */
        $rootScope.$broadcast('msSplashScreen::remove'); // 로딩창 비활성화
        vm.bgf = true;
        vm.isM = false;
        vm.surly = 'assets/images/backgrounds/skku_y.jpg';
        vm.surlm = 'assets/images/backgrounds/skku_m2.JPG';
        
        /* Methods */
        /**********************************************************************//**
        회원가입 버튼을 클릭했을 때 폼의 내용을 전송. */
	      vm.submitForm = function (
          ev) // 현재 이벤트
        {
            /* 비밀번호 확인 일치하지 않을 때 */
            if(vm.form.passWd != vm.form.passWdConfirm)
            {
                alert('비밀번호 확인이 일치하지 않습니다.');
            }
            else 
            {
                $http({
                    method : 'POST',
                    url : './api/member/signup',
                    data : $httpParamSerializerJQLike({
                        userId : vm.form.userId,
                        passWd : vm.form.passWd,
                        nickname : vm.form.nickname,
                        name : vm.form.username
                    }),
                    headers: {
                      'Content-Type' : 'application/x-www-form-urlencoded'
                    },
                    transformResponse: [function (data) 
                    {
                        return data;
                    }]
                }).then(function successCallback(response)
                {
                    /* ID가 중복된 경우 */
                    if (response.data == "duplicateId")
                    {
                      $mdDialog.show(
                        $mdDialog.alert()
                          .parent(angular.element($document.find('#content-container')))
                          .clickOutsideToClose(true)
                          .title('이미 존재하는 아이디입니다.')
                          .textContent('아이디를 다시 한번 확인해주시기 바랍니다.')
                          .ariaLabel('Alert Dialog ID')
                          .ok('확인')
                          .targetEvent(ev)
                      );
                    }
                    /* 닉네임이 중복된 경우 */
                    else if (response.data == "duplicateNickName")
                    {
                      $mdDialog.show(
                        $mdDialog.alert()
                          .parent(angular.element($document.find('#content-container')))
                          .clickOutsideToClose(true)
                          .title('이미 존재하는 닉네임입니다.')
                          .textContent('다른 닉네임으로 가입을 시도해주십시오.')
                          .ariaLabel('Alert Dialog Nickname')
                          .ok('확인')
                          .targetEvent(ev)
                      );
                    }
                    else
                    {  
                      $mdDialog.show(
                        $mdDialog.alert()
                          .parent(angular.element($document.find('#content-container')))
                          .clickOutsideToClose(true)
                          .title('회원가입 성공')
                          .textContent('가입시 입력하신 이메일을 통해 인증을 완료해주세요.')
                          .ariaLabel('Alert Dialog Success')
                          .ok('확인')
                          .targetEvent(ev)
                      );
                      $state.go('app.login');
                    }
                }, function errorCallback(response) 
                {
                    alert('에러가 발생했습니다.\n' + response.data);
                });
            }
        }




        /**********************************************************************//**
        약관 내용에 대한 다이얼로그를 띄움. */
        vm.openContractionDialog = function (
            ev) // 현재 이벤트
        {
            console.log("asd");
            $mdDialog.show({
                controller         : 'ContractionDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/register/dialog/contraction-dialog.html',
                parent             : angular.element($document.find('#content-container')),
                targetEvent        : ev,
                clickOutsideToClose: true
            });
        }
    }
})();
