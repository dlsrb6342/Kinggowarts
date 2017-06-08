(function ()
{
    'use strict';

    angular
        .module('app.map', ['ngMaterial', 'ngMessages'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.map', {
                url    : '/map',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/map/map.html',
                        controller : 'MapController as vm'
                    }
                },
                resolve: {
                    MPrinter: function($http, $sessionStorage){
                        return $http({
                            method: 'GET',
                            url: './api/marker?q=프린터',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                    },
                    MCafe: function($http, $sessionStorage){
                        return $http({
                            method: 'GET',
                            url: './api/marker?q=카페',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                    },
                    MInRest: function($http, $sessionStorage){
                        return $http({
                            method: 'GET',
                            url: './api/marker?q=교내식당',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                    },
                    MOutRest: function($http, $sessionStorage){
                        return $http({
                            method: 'GET',
                            url: './api/marker?q=교외식당',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                    },
                    MInEat: function($http, $sessionStorage){
                        return $http({
                            method: 'GET',
                            url: './api/marker?q=교내매점',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                    },
                    MATM: function($http, $sessionStorage){
                        return $http({
                            method: 'GET',
                            url: './api/marker?q=ATM',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                    },
                    MShelter: function($http, $sessionStorage){
                        return $http({
                            method: 'GET',
                            url: './api/marker?q=휴게실',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                    },
                    MMarket: function($http, $sessionStorage){
                        return $http({
                            method: 'GET',
                            url: './api/marker?q=편의점',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                    },
                    MBusstop: function($http, $sessionStorage){
                        return $http({
                            method: 'GET',
                            url: './api/marker?q=정류장',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                    },
                    
                    /*MarkerData: function ($q, msApi, $http, $sessionStorage)
                    {
                        
                        var deferred = $q.defer();
                        //return msApi.resolve('marker@get');
                        var prom = [];
                        prom[0] = msApi.resolve('categoryTypes@get');
                        prom[1] = $http({
                            method: 'GET',
                            url: './api/marker?q=프린터',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                        prom[2] = $http({
                            method: 'GET',
                            url: './api/marker?q=카페',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                        prom[3] = $http({
                            method: 'GET',
                            url: './api/marker?q=교내식당',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                        prom[4] = $http({
                            method: 'GET',
                            url: './api/marker?q=교외식당',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                        prom[5] = $http({
                            method: 'GET',
                            url: './api/marker?q=교내매점',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                        prom[6] = $http({
                            method: 'GET',
                            url: './api/marker?q=ATM',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });


                        //두 약속을 $q.all 메서드를 이용해 새로운 약속을 만든다.
                        return $q.all([prom[0], prom[1], prom[2], prom[3], prom[4], prom[5], prom[6]]);
                        
                    },*/
                    CategoryMarkerData: function(msApi)
                    {
                        return msApi.resolve('categoryMarker@get');
                    },
                    AreaAdmin: function(msApi, $http, $sessionStorage)
                    {
                        return $http({
                            method: 'GET',
                            url: './api/map?type=admin',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                    },
                    AreaUser: function(msApi, $http, $sessionStorage)
                    {
                        return $http({
                            method: 'GET',
                            url: './api/map?type=user',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                    },
                    DrawingMenuData: function(msApi)
                    {
                        return msApi.resolve('drawingMenu@get');
                    },
                    CustomEventData: function(msApi, $http, $sessionStorage)
                    {
                        //return msApi.resolve('customEvent@get');
                        return $http({
                            method: 'GET',
                            url: './api/event',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                    },
                    CategoryTypes: function(msApi)
                    {
                        return msApi.resolve('categoryTypes@get');
                    }
                    
                }
            });

        // Api
        msApiProvider.register('customEvent', ['app/data/map/customEvent.json']);
        msApiProvider.register('marker', ['app/data/map/marker.json']);
        msApiProvider.register('categoryTypes', ['app/data/map/categoryTypes.json']);
        msApiProvider.register('categoryMarker', ['app/data/map/categoryMarker.json']);
        msApiProvider.register('drawingMenu', ['app/data/map/drawingMenu.json']);
        
    }
})();