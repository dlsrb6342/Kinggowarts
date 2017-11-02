/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/findpw/findpw.controller.js
*  Author     : underkoo
*  Description: login 컨트롤러
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.findpw')
        .controller('FindpwController', FindpwController);

    /** @ngInject */

    function FindpwController(
        /* 모듈 */
        $http, 
        $httpParamSerializerJQLike,
        $state)
    {
        /* Data */
        var vm = this;

        vm.isdisabled = false;

        /* Methods */
        /**********************************************************************//**
        로그인 버튼 클릭했을 때 정보 전송하고 세션스토리지에 등록. */
        vm.clickFindPw = function () 
        {
            if (vm.isdisabled == false){
                vm.isdisabled = true;
                
                /* 새 비밀번호 발급 */
                $http({
                    method : 'POST',
                    url : './api/member/findPassword',
                    data : $httpParamSerializerJQLike({
                        email: vm.findpwForm.email,
                        name : vm.findpwForm.name
                    }),
                    headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
                    transformResponse: [function (data) 
                    {
                        return data;
                    }]
                }).then(function successCallback(
                    response)
                {
                    vm.isdisabled = false;
                    if(response.data === "success"){
                        console.log(response);
                        alert('입력된 이메일로 새 비밀번호가 발송되었습니다.');
                    }
                    else {
                        console.log(response);
                        alert('이메일 혹은 이름을 확인해주세요.');
                    }
                    
                }, function errorCallback(response) {
                    vm.isdisabled = false;
                    console.log(response);
                    alert('서버와 통신에 실패하였습니다.');
                });
            }
            
        };

    }
})();
