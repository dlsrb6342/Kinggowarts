(function ()
{
    'use strict';

    angular
        .module('app.register')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController($scope, $state,$rootScope,$http,$httpParamSerializerJQLike)
    {
        // Data
        var vm = this;
     
        
        
        // Methods
        
     
	vm.register_loginfun = function (username,email,password,location_share) {
        //user 회원정보 서버에 전송
	    $http({
	        method: 'POST',
	        url: './api/member/signup',
	        data: $httpParamSerializerJQLike({
	            nickname : username,
	            userId : email,
	            passWd : password,
	            type : 'S'
	        }),
	        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	        })
            $state.go('login');
        };

	$rootScope.$broadcast('msSplashScreen::remove');
        //////////

	
	
	
    }
})();
