(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('ProfileDialogController', ProfileDialogController);

    /** @ngInject */
    function ProfileDialogController($http, $httpParamSerializerJQLike, $mdDialog, $sessionStorage)
    {
        var vm = this;

        // Data
        vm.allFields = false;
        vm.profile = {};
        vm.profile.nickname = $sessionStorage.get('nickname');
        vm.profile.profileImgPath = $sessionStorage.get('profileImgPath');
        console.log($sessionStorage.get('AuthToken'));

        // Methods
        vm.init = init();
        vm.saveProfile = saveProfile;
        vm.closeDialog = closeDialog;
        vm.fileAdded = fileAdded;
        vm.upload = upload;
        vm.fileSuccess = fileSuccess;

        function init(){

            vm.ngFlowOptions = {
              target                   : './api/member/profileImg',
              chunkSize                : 15 * 1024 * 1024,
              maxChunkRetries          : 1,
              simultaneousUploads      : 1,
              testChunks               : false,
              progressCallbacksInterval: 1000
            };
            vm.ngFlow = {
                // ng-flow will be injected into here through its directive
                flow: {}
            };
            vm.dropping = false;
        }

        /**
         * Save contact
         */
        function saveProfile()
        {
            if(vm.profile.newPassword != vm.profile.newPasswordConfirm){
              alert('입력하신 비밀번호가 서로 일치하지 않습니다.');
            }
            else {
              $http({
                  method : 'POST',
                  url : './api/member/changePassword',
                  data : $httpParamSerializerJQLike({
                      newPassword : vm.profile.newPassword,
                      lastPassword : vm.profile.lastPassword
                  }),
                  headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'x-auth-token' : $sessionStorage.get('AuthToken')
                  },
                  transformResponse: [function (data) {
                      return data;
                  }]
              }).then(function successCallback(response){
                  if(response.data == "wrongPassword"){
                    alert('비밀번호가 일치하지 않습니다.');
                  }
                  else{
                    console.log(response.data);
                    closeDialog();
                  }
              }, function errorCallback(response) {
                  console.log(response);
              });
            }
        }

        /**
         * Close dialog
         */
        function closeDialog()
        {
            $mdDialog.hide();
        }

        function fileAdded(file)
        {
            console.log(file);
        }

        /**
         * Upload
         * Automatically triggers when files added to the uploader
         */
        function upload()
        {
            // Set headers
            vm.ngFlow.flow.opts.headers = {
                //'Content-Type'    : 'multipart/form-data',
                //'X-Requested-With': 'XMLHttpRequest',
                'x-auth-token'    : $sessionStorage.get('AuthToken')
            };

            vm.ngFlow.flow.upload();
        }

        /**
         * File upload success callback
         * Triggers when single upload completed
         *
         * @param file
         * @param message
         */
        function fileSuccess(file, message)
        {
            // Iterate through the media list, find the one we
            // are added as a temp and replace its data
            // Normally you would parse the message and extract
            // the uploaded file data from it
            console.log(file);
            console.log(message);
        }

    }
})();