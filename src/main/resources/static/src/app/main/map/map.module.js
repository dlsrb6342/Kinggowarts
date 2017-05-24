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
                    SubAreaData: function(msApi)
                    {
                        return msApi.resolve('subArea@get');
                    },
                    CustomEventData: function(msApi)
                    {
                        return msApi.resolve('customEvent@get');
                    },
                    CustomEventMarkerData: function(msApi)
                    {
                        return msApi.resolve('customEventMarker@get');
                    }
                }
            });

        // Api
        msApiProvider.register('marker', ['app/data/map/marker.json']);
        msApiProvider.register('categoryMarker', ['app/data/map/categoryMarker.json']);
        msApiProvider.register('subArea', ['app/data/map/subArea.json']);
        msApiProvider.register('customEvent', ['app/data/map/customEvent.json']);
         msApiProvider.register('customEventMarker', ['app/data/map/customEventMarker.json']);
    }
})();