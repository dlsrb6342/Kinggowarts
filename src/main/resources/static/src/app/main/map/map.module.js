(function ()
{
    'use strict';

    angular
        .module('app.map', ['ngMaterial'])
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
                    MarkerData: function (msApi)
                    {
                        return msApi.resolve('marker@get');
                    },
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
                        //return msApi.resolve('subArea@get');
                    },
                    AreaUser: function(msApi, $http, $sessionStorage)
                    {
                        return $http({
                            method: 'GET',
                            url: './api/map?type=user',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });
                        //return msApi.resolve('subArea@get');
                    },
                    DrawingMenuData: function(msApi)
                    {
                        return msApi.resolve('drawingMenu@get');
                    },
                    CustomEventData: function(msApi, $http, $sessionStorage)
                    {
                        return msApi.resolve('customEventData@get');
                        /*return $http({
                            method: 'GET',
                            url: './api/event',
                            headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                        });*/
                    }
                    
                }
            });

        // Api
        msApiProvider.register('marker', ['app/data/map/marker.json']);
        msApiProvider.register('categoryMarker', ['app/data/map/categoryMarker.json']);
        msApiProvider.register('customEventData', ['app/data/map/customEvent.json']);
        msApiProvider.register('drawingMenu', ['app/data/map/drawingMenu.json']);
        
    }
})();