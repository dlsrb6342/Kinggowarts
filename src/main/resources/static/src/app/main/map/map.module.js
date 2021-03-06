(function ()
{
    'use strict';

    angular
        .module('app.main.map', ['ngMaterial', 'ngMessages'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.main.map', {
                url    : '/map',
                views  : {
                    'content@app.main': {
                        templateUrl: 'app/main/map/map.html',
                        controller : 'MapController as vm'
                    },
                    'map-side@app.main.map': {
                        templateUrl: 'app/main/map/map-side/map-side.html',
                        controller : 'MapSideController as vm'
                    }
                },                
                resolve: {
                    MarkerData: function (msApi)
                    {
                        return msApi.resolve('marker@get');
                    }
                    /*
                    MBusstop: function($http, $sessionStorage){
                        return $http({
                            method: 'GET',
                            url: './api/marker?q=정류장',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                    },*/
                    
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
                    /*CategoryMenuData: function(msApi)
                    {
                        return msApi.resolve('categoryMenu@get');
                    }
                    */
                }
            });

        // Api

        
        msApiProvider.register('marker', ['app/data/map/marker.json']);  
        //msApiProvider.register('categoryMenu', ['app/data/map/categoryMenu.json']);
        
        
    }
})();