/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/login/dialog/contraction-dialog.controller.js
*  Author     : underkoo
*  Description: 로그인 화면에서의 약관 dialog 모듈 컨트롤러
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.main.toolbar')
        .controller('ContractionDialogController', ContractionDialogController);

    /** @ngInject */
    function ContractionDialogController(
      /* 모듈 */
      $mdDialog)
    {
        /* Data */
        var vm = this;

        /* 초기화 */
        
        function init(){
        }

        init();

        /* Methods */
        /**********************************************************************//**
        dialog 종료. */
        vm.closeDialog = function ()
        {
            $mdDialog.hide();
        }

    }
})();