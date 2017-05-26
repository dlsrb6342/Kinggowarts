(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider)
    {
        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('app', {
                abstract: true,
                views   : {
                    'main@'         : {
                        templateUrl: 'app/core/layouts/main.html',
                        controller : 'MainController as vm'
                    },
                    'toolbar@app'   : {
                        templateUrl: 'app/toolbar/layouts/toolbar.html',
                        controller : 'ToolbarController as vm'
                    },
                    'quickPanel@app': {
                        templateUrl: 'app/quick-panel/quick-panel.html',
                        controller : 'QuickPanelController as vm'
                    }
                },
                resolve: {
                    /*
                    TimelineData: function (msApi)
                    {
                        return msApi.resolve('quickPanel.timeline@get');
                    },
                    */
                    TimelineData: function ($http)
                    {
                        var obj = {content:null};
                        $http.get('app/data/quick-panel/timeline.json').then(function (response){
                            obj.content = response;
                        });
                        return obj;
                    },
                    PeerData: function ($http)
                    {
                        var obj = {content:null};
                        $http.get('app/data/quick-panel/peer.json').then(function (response){
                            obj.content = response;
                        });
                        return obj;
                    },
                    RequestData: function ($http)
                    {
                        var obj = {content:null};
                        $http.get('app/data/quick-panel/request.json').then(function (response){
                            obj.content = response;
                        });
                        return obj;
                    },
                    RecentwikiData: function ($http)
                    {
                        var obj = {content:null};
                        $http.get('app/data/quick-panel/recentwiki.json').then(function (response){
                            obj.content = response;
                        });
                        return obj;
                    }
                }
            });
    }

})();
