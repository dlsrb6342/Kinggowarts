(function ()
{
    'use strict';

    angular
        .module('app.register')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController($document, $state, $http, $httpParamSerializerJQLike, $mdDialog, $rootScope)
    {
        // Data
        var vm = this;
     
        vm.form = {};
        
        // Methods
       
        vm.submitForm = submitForm;
        
        $rootScope.$broadcast('msSplashScreen::remove');
        
        //register function
	    function submitForm (ev) {
            if(vm.form.passWd != vm.form.passWdConfirm){
                alert('비밀번호 확인이 일치하지 않습니다.');
            }
            else {
                $http({
                    method : 'POST',
                    url : './api/member/signup',
                    data : $httpParamSerializerJQLike({
                        userId : vm.form.userId,
                        passWd : vm.form.passWd,
                        nickname : vm.form.nickname,
                        name : vm.form.username
                    }),
                    headers: {
                      'Content-Type' : 'application/x-www-form-urlencoded'
                    },
                    transformResponse: [function (data) {
                        return data;
                    }]
                }).then(function successCallback(response){
                    if(response.data == "duplicateId"){
                      $mdDialog.show(
                        $mdDialog.alert()
                          .parent(angular.element($document.find('#content-container')))
                          .clickOutsideToClose(true)
                          .title('이미 존재하는 아이디입니다.')
                          .textContent('아이디를 다시 한번 확인해주시기 바랍니다.')
                          .ariaLabel('Alert Dialog ID')
                          .ok('확인')
                          .targetEvent(ev)
                      );
                    }
                    else if (response.data == "duplicateNickName"){
                      $mdDialog.show(
                        $mdDialog.alert()
                          .parent(angular.element($document.find('#content-container')))
                          .clickOutsideToClose(true)
                          .title('이미 존재하는 닉네임입니다.')
                          .textContent('다른 닉네임으로 가입을 시도해주십시오.')
                          .ariaLabel('Alert Dialog Nickname')
                          .ok('확인')
                          .targetEvent(ev)
                      );
                    }
                    else{  
                      $mdDialog.show(
                        $mdDialog.alert()
                          .parent(angular.element($document.find('#content-container')))
                          .clickOutsideToClose(true)
                          .title('회원가입 성공')
                          .textContent('가입시 입력하신 이메일을 통해 인증을 완료해주세요.')
                          .ariaLabel('Alert Dialog Success')
                          .ok('확인')
                          .targetEvent(ev)
                      );
                      $state.go('login');
                    }
                }, function errorCallback(response) {
                    console.log(response);
                    alert('에러가 발생했습니다.\n' + response.data);
                });
            }
        }
    }
})();
