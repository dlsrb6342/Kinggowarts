/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/login/login.module.js
*  Author     : underkoo
*  Description: login 모듈 정의
*******************************************************/


(function ()
{
    'use strict';

    angular
        .module('app.login', [])
        .config(config);

    /** @ngInject */
    function config(
        /* 모듈 */
        $stateProvider)
    {
        /* state 정의 */
        $stateProvider
            .state('app.login', {
                url      : '/login?auth',
                views    : {
                    'main@' : {
                        templateUrl: 'app/login/login.html',
                        controller : 'LoginController as vm'
                    }
                }
            });
    }

})();