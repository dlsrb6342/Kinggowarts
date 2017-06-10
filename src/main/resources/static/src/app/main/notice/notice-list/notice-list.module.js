(function ()
{
    'use strict';

    angular
        .module('app.main.notice.list',
            [
                // 3rd Party Dependencies
                'datatables',
                'app.main.notice.list.item'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, msNavigationServiceProvider)
    {
        // State
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