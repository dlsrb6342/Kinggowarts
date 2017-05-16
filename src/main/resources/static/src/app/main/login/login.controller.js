(function ()
{
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($state, $rootScope)
    {
        // Data
        var vm = this;
        vm.email = '';
        vm.password = '';
        // Methods
        vm.loginfun = function (email,password) {

            //서버에 email, password 보내서 확인 받기
            $rootScope.email = email;
            $state.go('app.map');
        };

        $rootScope.$broadcast('msSplashScreen::remove');

        //////////
    }
})();