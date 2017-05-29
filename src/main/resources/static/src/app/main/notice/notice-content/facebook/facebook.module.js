(function ()
{
    'use strict';

    angular
        .module('app.notice.facebook',
            [
                // 3rd Party Dependencies
                'datatables'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.notice.facebook', {
                url    : '/facebook',
                views  : {
                    'notice-content@app.notice': {
                        templateUrl: 'app/main/notice/notice-content/facebook/facebook.html',
                        controller : 'FacebookController as vm'
                    }
                },
                resolve: {
                    FacebookData: function ($http)
                    {
                        return $http.get('/api/notice');
                    }
                }
            });

        // Navigation
        msNavigationServiceProvider.saveItem('notice.facebook', {
            title : 'Facebook',
            icon  : 'icon-cart',
            state : 'app.notice.facebook',
            weight: 3
        });
       
    }
})();