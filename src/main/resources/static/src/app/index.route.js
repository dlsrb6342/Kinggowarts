(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/login');

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
