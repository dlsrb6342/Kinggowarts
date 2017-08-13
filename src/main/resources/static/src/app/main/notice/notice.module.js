/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/main/notice/notice.module.js
*  Author     : underkoo
*  Description: notice 전체 모듈 정의
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.main.notice', [
            
            'app.main.notice.navigation', // Navigation
            
            'app.main.notice.list' // Content

            ])
        .config(config);

    /** @ngInject */
    function config(
        /* 모듈 */
        $stateProvider, 
        $translatePartialLoaderProvider, 

        /* 서비스 */
        msNavigationServiceProvider)
    {
        /* state 정의 */
        $stateProvider
            .state('app.main.notice', {
                abstract: true,
                url    : '/notice',
                views  : {
                    'content@app.main': {
                        templateUrl: 'app/main/notice/notice.html',
                        controller : 'NoticeController as vm'
                    },
                    'notice-navigation@app.main.notice': {
                        templateUrl: 'app/main/notice/notice-navigation/notice-navigation.html',
                        controller : 'NoticeNavigationController as vm'
                    }
                }
            });

        /* msNavigation 디렉티브를 통한 네비게이션 생성 */
        msNavigationServiceProvider.saveItem('notice', {
            title : '공지사항',
            group : true,
            weight: 4
        });
    }
})();