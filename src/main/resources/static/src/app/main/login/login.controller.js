(function ()
{
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    /** @ngInject */

    function LoginController($state, $rootScope, $sessionStorage, $http)
    {
        // Data
        var vm = this;
        
        vm.useraccount = {
            ID : '',
            password : ''
        };

        $sessionStorage.empty();

        // Methods
        vm.loginfun = function (email,password) {

            vm.useraccount.ID = email;
            vm.useraccount.password = password;

            /*

            $http.post('/api/users/account', JSON.stringify(vm.useraccount)).then(function(response){
                if(response.data.val == true){
                    $sessionStorage.put('AuthToken', response.data.auth, 0.5);
                    $sessionStorage.put('useremail', email, 0.5);
                    $state.go('app.map');
                }
                else{
                    alert('아이디나 비밀번호를 확인해주세요.');
                }
            });

            */

            //서버에 email, password 보내서 확인 받기 필요
            //받은 후 아래 작업 실행
            $sessionStorage.put('useremail', email, 0.5);
            $sessionStorage.put('AuthToken', "1111", 0.5);

            $state.go('app.map');
        };

        $rootScope.$broadcast('msSplashScreen::remove');

        //////////
    }
})();