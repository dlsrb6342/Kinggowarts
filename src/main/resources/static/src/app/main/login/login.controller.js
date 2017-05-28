(function ()
{
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    /** @ngInject */

    function LoginController($state, $rootScope, $sessionStorage)
    {
        // Data
        var vm = this;
        vm.email = '';
        vm.password = '';
        // Methods
        vm.loginfun = function (email,password) {

            //서버에 email, password 보내서 확인 받기 필요
            //받은 후 아래 작업 실행
            $sessionStorage.put('useremail', email, 0.5);
            $state.go('app.map');
        };

        $rootScope.$broadcast('msSplashScreen::remove');

        //////////
    }
})();