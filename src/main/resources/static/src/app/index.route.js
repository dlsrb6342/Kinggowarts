/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/index.route.js
*  Author     : underkoo
*  Description: 메인 라우팅
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('kinggowarts')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig(
        /* 모듈 */
        $locationProvider,
        $stateProvider, 
        $urlRouterProvider)
    {
        $locationProvider.html5Mode(true);

        /* default url은 /login으로 둠. */
        $urlRouterProvider.otherwise('/login');

        /* 메인 state를 app으로 정의하고 모든 state를 app의 밑에 둠. */
        $stateProvider
            .state('app', {
                abstract: true,
                resolve: {
                    NoticeCategoryData: function ($http)
                    {
                        
                        return $http({
                            method: 'GET',
                            url: 'app/data/notice_category.json'
                        });
                    }
                }
            });
    }

})();
