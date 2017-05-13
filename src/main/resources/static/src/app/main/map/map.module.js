(function ()
{
    'use strict';

    angular
        .module('app.map', [])
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
                    SampleData: function (msApi)
                    {
                        return msApi.resolve('sample@get');
                    }
                }
            });

       
    }
})();