/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/index.module.js
*  Author     : underkoo
*  Description: 메인 모듈 정의
*******************************************************/

(function ()
{
    'use strict';

    /**
     * Main module of the kinggowarts
     */
    angular
        .module('kinggowarts', [

            'app.core', // Core - 디렉티브나 서비스 등 정의.

            'app.main', // main module

            'app.login', // login module

            'app.findpw', // find password module

            'app.register', // register module
            
            'swxSessionStorage' // 세션 스토리지 모듈
        ]);
})();