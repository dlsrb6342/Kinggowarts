(function ()
{
    'use strict';

    angular
        .module('app.main.notice', [

            // Navigation
            'app.main.notice.navigation',

            // Content
            'app.main.notice.list'

            ])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
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

        msNavigationServiceProvider.saveItem('notice', {
            title : '공지사항',
            group : true,
            weight: 4
        });
    }
})();