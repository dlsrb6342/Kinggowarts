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
                    TimelineData: function ($http)
                    {
                        //임시
                        var obj = $http.get('/app/data/quick-panel/timeline.json');
                        return obj;
                    },
                    PeerData: function ($http)
                    {
                        //임시
                        var obj = $http.get('/app/data/quick-panel/peer.json');
                        return obj;
                    },
                    RequestData: function ($http)
                    {
                        //임시
                        var obj = $http.get('/app/data/quick-panel/request.json');
                        return obj;
                    },
                    Notice: function ($http)
                    {
                        //임시
                        var obj = $http.get('/app/data/quick-panel/recentwiki.json');
                        return obj;
                    },
                    
                    RecentwikiData: function ($http)
                    {
                        var obj;
                        //obj = $http.get('http://fanatic1.iptime.org:8080/xwiki/rest/wikis/xwiki/modifications?start=0&number=30');
                        return obj;
                    }
                    
                }
            });
    }

})();
