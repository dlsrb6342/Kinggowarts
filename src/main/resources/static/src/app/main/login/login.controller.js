(function ()
{
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    /** @ngInject */

    function LoginController($state, $stateParams, $rootScope, $sessionStorage, $http, $httpParamSerializerJQLike)
    {
        // Data
        var vm = this;
        // console.log($stateParams);
        if($stateParams.auth == 'true'){
            alert('인증이 완료되었습니다.');
        }
        $sessionStorage.empty();
        $http({
                    method : 'GET',
                    url : '../xwiki/bin/logout/XWiki/XWikiLogout'
                })

        vm.isdisabled = false;

        // Methods
        vm.loginfun = function (email,password) {
            if (vm.isdisabled == false){
                vm.isdisabled = true;
                $http({
                    method : 'POST',
                    url : './api/auth/login',
                    data : $httpParamSerializerJQLike({
                        username : email,
                        password : password
                    }),
                    headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
                }).then(function successCallback(response){
                    //console.log(response);
                    
                    $sessionStorage.put('nickname', response.data.nickname, 50);
                    $sessionStorage.put('memberSeq', response.data.memberSeq, 50);
                    $sessionStorage.put('useremail', response.data.userId, 50);
                    $sessionStorage.put('AuthToken', response.data.token, 50);
                    $sessionStorage.put('profileImgPath', response.data.profileImgPath, 50);
                    $sessionStorage.put('username', response.data.name, 50);

                    var nickname = response.data.nickname;

                    $http({
                        method : 'GET',
                        url : './xwiki/bin/login/',
                        withCredentials: true,
                        headers:{'Authorization' : 'Basic ' + btoa(nickname+":"+password)}
                    }).then(function successCallback(response){

                        $state.go('app.map');

                    }, function errorCallback(response) {
                        vm.isdisabled = false;
                        alert('위키 로그인에 실패하였습니다.');
                    });
                    
                }, function errorCallback(response) {
                    vm.isdisabled = false;
                    alert('아이디나 비밀번호를 확인해주세요.');
                });
            }
            
        };

        $rootScope.$broadcast('msSplashScreen::remove');

        //////////
    }
})();
