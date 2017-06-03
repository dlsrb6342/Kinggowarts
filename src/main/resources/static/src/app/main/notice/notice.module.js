(function ()
{
    'use strict';

    angular
        .module('app.notice', [

            // Navigation
            'app.notice.navigation',

            // Facebook
            'app.notice.facebook'

            ])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.notice', {
                abstract: true,
                url    : '/notice',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/notice/notice.html',
                        controller : 'NoticeController as vm'
                    },
                    'notice-navigation@app.notice': {
                        templateUrl: 'app/main/notice/notice-navigation/notice-navigation.html',
                        controller : 'NavigationController as vm'
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