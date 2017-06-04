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
                    SubAreaData: function(msApi, $http, $httpParamSerializerJQLike)
                    {
                        return msApi.resolve('subArea@get');
                        
                        /*var obj;
                        obj = $http({
                            method: 'GET',
                            url: './api/map?type=admin',
                            //data: $httpParamSerializerJQLike({

                            //}),
                            headers: {'x-auth-token': '55c68006-4ae7-4806-852c-649b0f0545e9'}
                        });
                        return obj;*/

                    },
                    DrawingMenuData: function(msApi)
                    {
                        return msApi.resolve('drawingMenu@get');
                    },
                    CustomEventData: function(msApi)
                    {
                        return msApi.resolve('customEventData@get');
                    }
                    /*
                    MarkerData: function ($http, $sessionStorage)
                    {
                        var obj = $http.get('/api/map?xxmarkerrxxx', {
                            headers : {
                                'Authorization' : $sessionStorage.get('AuthToken')
                            }
                        });
                        return obj;
                    },
                    CategoryMarkerData: function ($http, $sessionStorage)
                    {
                        return msApi.resolve('categoryMarker@get');
                    },
                    SubAreaData: function ($http, $sessionStorage)          ++ admin
                    {
                        var obj = $http.get('/api/map?type=user', {
                            headers : {
                                'Authorization' : $sessionStorage.get('AuthToken')
                            }
                        });
                        return obj;
                    },
                    DrawingMenuData: function ($http, $sessionStorage)
                    {
                        return msApi.resolve('drawingMenu@get');
                    },
                    CustomEventData: function ($http, $sessionStorage)
                    {
                        var obj = $http.get('/api/map?xxxcustomxxx', {
                            headers : {
                                'Authorization' : $sessionStorage.get('AuthToken')
                            }
                        });
                        return obj;
                    }
                    */
                }
            });

        // Api
        msApiProvider.register('marker', ['app/data/map/marker.json']);
        msApiProvider.register('categoryMarker', ['app/data/map/categoryMarker.json']);
        msApiProvider.register('subArea', ['app/data/map/subArea.json']);
        msApiProvider.register('drawingMenu', ['app/data/map/drawingMenu.json']);
        msApiProvider.register('customEventData', ['app/data/map/customEvent.json']);
    }
})();