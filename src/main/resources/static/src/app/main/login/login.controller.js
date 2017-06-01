(function ()
{
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    /** @ngInject */

    function LoginController($state, $rootScope, $sessionStorage, $http, $httpParamSerializerJQLike)
    {
        // Data
        var vm = this;

        $sessionStorage.empty();

        // Methods
        vm.loginfun = function (email,password) {

            $http({
                method : 'POST',
                url : './api/auth/login',
                data : $httpParamSerializerJQLike({
                    username : email,
                    password : password
                }),
                headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response){

                $sessionStorage.put('useremail', response.data.userId, 5);
                $sessionStorage.put('AuthToken', response.data.token, 5);
                var nickname = response.data.nickname;

                $http({
                    method : 'GET',
                    url : location.protocol+"//"+location.host+"/xwiki/bin/login/",
                    withCredentials: true,
                    headers:{'Authorization' : 'Basic ' + btoa(nickname+":"+password)}
                }).then(function successCallback(response){

                    $state.go('app.map');

                }, function errorCallback(response) {
                    alert('위키 로그인에 실패하였습니다.');
                });
                
            }, function errorCallback(response) {
                alert('아이디나 비밀번호를 확인해주세요.');
            });

        };

        $rootScope.$broadcast('msSplashScreen::remove');

        //////////
    }
})();