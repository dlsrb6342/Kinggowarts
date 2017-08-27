/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/main/wiki/wiki.controller.js
*  Author     : underkoo
*  Description: wiki 모듈 컨트롤러 정의
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.main.wiki')
        .controller('WikiController', WikiController);

    /** @ngInject */
    function WikiController(
        /* 모듈 */
        $rootScope,
        $sce)
    {
        /* Data */
        var vm = this;
        vm.path = $rootScope.wikipath
        
        /* Methods */
        /**********************************************************************//**
        sce 모듈을 통해 받은 url을 trust하게 만듦. */
        vm.getUrl = function () 
        {
            return $sce.trustAsResourceUrl(vm.path);
        };
       
    }
})();
