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

        /**
         * Layout Style Switcher
         *
         * This code is here for demonstration purposes.
         * If you don't need to switch between the layout
         * styles like in the demo, you can set one manually by
         * typing the template urls into the `State definitions`
         * area and remove this code
         */
        // Inject $cookies
        var $cookies;

        angular.injector(['ngCookies']).invoke([
            '$cookies', function (_$cookies)
            {
                $cookies = _$cookies;
            }
        ]);

        // Get active layout
        var layoutStyle = $cookies.get('layoutStyle') || 'contentWithToolbar';

        var layouts = {
            verticalNavigation  : {
                main      : 'app/core/layouts/vertical-navigation.html',
                toolbar   : 'app/toolbar/layouts/vertical-navigation/toolbar.html',
                navigation: 'app/navigation/layouts/vertical-navigation/navigation.html'
            },
            verticalNavigationFullwidthToolbar  : {
                main      : 'app/core/layouts/vertical-navigation-fullwidth-toolbar.html',
                toolbar   : 'app/toolbar/layouts/vertical-navigation-fullwidth-toolbar/toolbar.html',
                navigation: 'app/navigation/layouts/vertical-navigation/navigation.html'
            },
            verticalNavigationFullwidthToolbar2  : {
                main      : 'app/core/layouts/vertical-navigation-fullwidth-toolbar-2.html',
                toolbar   : 'app/toolbar/layouts/vertical-navigation-fullwidth-toolbar-2/toolbar.html',
                navigation: 'app/navigation/layouts/vertical-navigation-fullwidth-toolbar-2/navigation.html'
            },
            horizontalNavigation: {
                main      : 'app/core/layouts/horizontal-navigation.html',
                toolbar   : 'app/toolbar/layouts/horizontal-navigation/toolbar.html',
                navigation: 'app/navigation/layouts/horizontal-navigation/navigation.html'
            },
            contentOnly         : {
                main      : 'app/core/layouts/content-only.html',
                toolbar   : '',
                navigation: ''
            },
            contentWithToolbar  : {
                main      : 'app/core/layouts/content-with-toolbar.html',
                toolbar   : 'app/toolbar/layouts/content-with-toolbar/toolbar.html',
                navigation: ''
            }
        };
        // END - Layout Style Switcher

        // State definitions

        $stateProvider
            .state('app', {
                abstract: true,
                views   : {
                    'main@'         : {
                        templateUrl: layouts[layoutStyle].main,
                        controller : 'MainController as vm'
                    },
                    'toolbar@app'   : {
                        templateUrl: layouts[layoutStyle].toolbar,
                        controller : 'ToolbarController as vm'
                    },
                    'navigation@app': {
                        templateUrl: layouts[layoutStyle].navigation,
                        controller : 'NavigationController as vm'
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
