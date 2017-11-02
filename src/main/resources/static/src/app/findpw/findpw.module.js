/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/findpw/login.module.js
*  Author     : underkoo
*  Description: login 모듈 정의
*******************************************************/


(function ()
{
    'use strict';

    angular
        .module('app.findpw', [])
        .config(config);

    /** @ngInject */
    function config(
        /* 모듈 */
        $stateProvider)
    {
        /* state 정의 */
        $stateProvider
            .state('app.findpw', {
                url      : '/findpw',
                views    : {
                    'main@' : {
                        templateUrl: 'app/findpw/findpw.html',
                        controller : 'FindpwController as vm'
                    }
                }
            });
    }

})();