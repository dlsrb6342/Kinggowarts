/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/main/toolbar/dialog/profile-dialog.controller.js
*  Author     : underkoo
*  Description: 툴바의 profile 관리 dialog 모듈 컨트롤러
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.main.toolbar')
        .controller('ProfileDialogController', ProfileDialogController);

    /** @ngInject */
    function ProfileDialogController(
      /* 모듈 */
      $http, 
      $httpParamSerializerJQLike, 
      $mdDialog, 
      $sessionStorage, 

      /* 서비스 */
      profileImageFactory)
    {
        /* Data */
        var vm = this;

        /* 초기화 */
        vm.allFields = false;
        vm.profile = {};
        vm.profile.nickname = $sessionStorage.get('nickname');
        vm.profile.profileImg = profileImageFactory;
        
        function init(){

            vm.ngFlowOptions = {
              target                   : './api/member/profileImg',
              chunkSize                : 15 * 1024 * 1024,
              maxChunkRetries          : 1,
              simultaneousUploads      : 1,
              testChunks               : false,
              progressCallbacksInterval: 1000
            };
            vm.ngFlow = {
                // ng-flow will be injected into here through its directive
                flow: {}
            };
            vm.dropping = false;
        }

        init();

        /* Methods */
        /**********************************************************************//**
        입력된 프로필 저장. */
        vm.saveProfile = function ()
        {
            if(vm.profile.newPassword != vm.profile.newPasswordConfirm){
              alert('비밀번호 확인이 일치하지 않습니다.');
            }
            else {
              $http({
                  method : 'POST',
                  url : './api/member/changePassword',
                  data : $httpParamSerializerJQLike({
                      newPassword : vm.profile.newPassword,
                      lastPassword : vm.profile.lastPassword
                  }),
                  headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'x-auth-token' : $sessionStorage.get('AuthToken')
                  },
                  transformResponse: [function (data) {
                      return data;
                  }]
              }).then(function successCallback(response){
                  if(response.data == "wrongPassword"){
                    alert('비밀번호가 일치하지 않습니다.');
                  }
                  else{
                    //console.log(response.data);
                    closeDialog();
                  }
              }, function errorCallback(response) {
                  //console.log(response);
              });
            }
        }

        /**********************************************************************//**
        dialog 종료. */
        vm.closeDialog = function ()
        {
            $mdDialog.hide();
        }

        /**********************************************************************//**
        파일 추가됨. */
        vm.fileAdded = function (
          file) // 추가된 파일
        {
            //console.log(file);
        }

        /**********************************************************************//**
        파일 자동 업로드 */
        vm.upload = function ()
        {
            // Set headers
            vm.ngFlow.flow.opts.headers = {
                //'Content-Type'    : 'multipart/form-data',
                //'X-Requested-With': 'XMLHttpRequest',
                'x-auth-token'    : $sessionStorage.get('AuthToken')
            };

            vm.ngFlow.flow.upload();
        }

        /**********************************************************************//**
        파일 업로드 성공시 콜백 */
        vm.fileSuccess = function (
          file, // 업로드한 파일
          message) // return 메세지
        {
            //console.log(message);
            if(message != 'error'){
              $sessionStorage.put('profileImgPath', message, 50);
              profileImageFactory.image_path = message;
            }
            else{
              alert('에러가 발생했습니다.');
            }
        }

    }
})();