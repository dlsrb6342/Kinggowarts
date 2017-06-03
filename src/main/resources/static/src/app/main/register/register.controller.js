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
        //File upload
        $scope.images = [];
        //파일 처리
        $scope.processFiles = function (uploadImages) {
            angular.forEach(uploadImages, function (flowFile, i) {
                var fileReader = new FileReader();
                fileReader.onload = function (event) {
                    var uri = event.target.result;
                    $scope.images[i] = uri;
                };
                fileReader.readAsDataURL(flowFile.file);
            });
        };

        //image upload
        $scope.imageUpload = function (file) {

            if (file != null) {
                file.upload = Upload.upload({
                    url: './api/member/imageUpload',
                    method: 'POST',
                    file: file
                }).success(function (data) {
                    console.log('Success');
                });
            }
        };
        
           
        
        
	vm.register_loginfun = function (username,email,password,location_share) {
        //user 회원정보 서버에 전송
	    $http({
	        method: 'POST',
	        url: './api/member/signup',
	        data: $httpParamSerializerJQLike({
	            nickname : username,
	            userId : email,
	            passWd : password,
	            type : location_share,
	        }),
	        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	        })
            $state.go('login');
        };

	$rootScope.$broadcast('msSplashScreen::remove');
        //////////

	
	
	
    }
})();
