(function ()
{
    'use strict';

    angular
        .module('app.wiki', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.wiki', {
                url    : '/wiki',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/wiki/wiki.html',
                        controller : 'WikiController as vm'
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