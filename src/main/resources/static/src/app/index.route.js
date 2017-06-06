(function ()
{
    'use strict';

    angular
        .module('fuse')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $sessionStorageProvider)
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
                    PeerData: function ($http, $sessionStorage)
                    {

                        var obj = $http.get('./api/member/peer', {
                            headers : {'x-auth-token' : $sessionStorage.get('AuthToken')}
                        });
                        return obj
                    },
                    RequestData: function ($http, $sessionStorage)
                    {
                        var obj = $http.get('./api/member/reqPeerToMe', {
                            headers : {'x-auth-token' : $sessionStorage.get('AuthToken')}
                        });
                        return obj
                    },                 
                    RecentwikiData: function ($http)
                    {
                        var obj;
                        obj = $http.get('../xwiki/rest/wikis/xwiki/modifications?start=0&number=100');
                        return obj;
                    },
                    SkkuData: function ($http, $sessionStorage)
                    {
                        
                        var obj = $http.get('./api/notice?all=false&category=skku&size=10&page=0', {
                            headers : {'x-auth-token' : $sessionStorage.get('AuthToken')}
                        });
                        return obj;
                    },
                    CsData: function ($http, $sessionStorage)
                    {
                        
                        var obj = $http.get('./api/notice?all=false&category=cs&size=10&page=0', {
                            headers : {'x-auth-token' : $sessionStorage.get('AuthToken')}
                        });
                        return obj;
                    },
                    FbData: function ($http, $sessionStorage)
                    {
                        
                        var obj = $http.get('./api/notice?all=false&category=fb&size=10&page=0', {
                            headers : {'x-auth-token' : $sessionStorage.get('AuthToken')}
                        });
                        return obj;
                    },
                }
            });
    }

})();
