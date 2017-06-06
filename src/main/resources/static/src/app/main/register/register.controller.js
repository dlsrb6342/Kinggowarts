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
       
           
        
        //register function
	vm.register_loginfun = function (email,password,nick,username) {
        
	    $http({
	        method: 'POST',
	        url: './api/member/signup',
	        data: $httpParamSerializerJQLike({
	        	userId: email,
                	passWd: password,
                	nickname: nick,
                	name: username
	        }),
	        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	        })
            $state.go('login');
            alert('회원가입에 성공하셨습니다');
        };

	$rootScope.$broadcast('msSplashScreen::remove');
        //////////

	
	
	
    }
})();
