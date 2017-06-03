(function ()
{
    'use strict';

    angular
        .module('app.notice.list.item',
            [
                // 3rd Party Dependencies
                'datatables'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        // State
        $stateProvider
            .state('app.notice.list.item', {
                url    : '/:id',
                views  : {
                    'notice-item@app.notice.list': {
                        templateUrl: 'app/main/notice/notice-list/notice-item/notice-item.html',
                        controller : 'NoticeItemController as vm'
                    }
                },
                resolve: {
                    NoticeItemData: function ($http, $sessionStorage, $stateParams)
                    {
                        var obj = $http({
                            method : 'GET',
                            url : './api/notice/' + $stateParams.id,
                            headers: {'x-auth-token' : $sessionStorage.get('AuthToken')}
                        });
                        return obj;
                    }
                }
            });
       
    }
})();