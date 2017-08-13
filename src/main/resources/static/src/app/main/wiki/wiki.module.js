/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/main/wiki/wiki.module.js
*  Author     : underkoo
*  Description: wiki 모듈 정의
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.main.wiki', [])
        .config(config);

    /** @ngInject */
    function config(
        /* 모듈 */
        $stateProvider, 
        $translatePartialLoaderProvider)
    {
        /* state 정의 */
        $stateProvider
            .state('app.main.wiki', {
                url    : '/wiki',
                views  : {
                    'content@app.main': {
                        templateUrl: 'app/main/wiki/wiki.html',
                        controller : 'WikiController as vm'
                    }
                }
            });

       
    }
})();