/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/index.controller.js
*  Author     : underkoo
*  Description: 메인 컨트롤러
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('kinggowarts')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(
        /* 모듈 */
        $rootScope,

        /* 서비스 */
        fuseTheming)
    {
        var vm = this;
        $rootScope.wikipath = "../xwiki/bin/view/XWiki/";

        /* 기본 테마를 fuse 테마 서비스로 설정. */
        vm.themes = fuseTheming.themes;

        //////////
    }
})();