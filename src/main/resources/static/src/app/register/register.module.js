/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/register/register.module.js
*  Author     : underkoo
*  Description: register 모듈 정의
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.register', [])
        .config(config);

    /** @ngInject */
    function config(
        /* 모듈 */
        $stateProvider)
    {
        /* state 정의 */
        $stateProvider
            .state('app.register', {
                url: '/register',
                views: {
                    
                    'main@' : {
                        templateUrl: 'app/register/register.html',
                        controller: 'RegisterController as vm'
                    }
                    
                }
            });
       
    }

})();
