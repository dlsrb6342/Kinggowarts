/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/main/notice/notice-list/notice-list.module.js
*  Author     : underkoo
*  Description: notice-list 모듈 정의 
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.main.notice.list',
            [
                'app.main.notice.list.item', // notice-item 모듈

                'datatables' // 데이터 테이블 모듈
            ]
        )
        .config(config);

    /** @ngInject */
    function config(
        /* 모듈 */
        $stateProvider, 

        /* 서비스 */
        msNavigationServiceProvider)
    {
        /* state 정의 */
        $stateProvider
            .state('app.main.notice.list', {
                url    : '/:category',
                views  : {
                    'notice-list@app.main.notice': {
                        templateUrl: 'app/main/notice/notice-list/notice-list.html',
                        controller : 'NoticeListController as vm'
                    }
                },
                resolve: {
                    NoticeListData: function ($http, $sessionStorage, $stateParams)
                    {   
                        var obj = $http({
                            method : 'GET',
                            url : './api/notice?all=true&category=' + $stateParams.category,
                            headers: {'x-auth-token' : $sessionStorage.get('AuthToken')}
                        })
                        return obj;
                    }
                }
            });
    }
})();