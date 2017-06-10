(function ()
{
    'use strict';

    angular
        .module('app.main.wiki', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.main.wiki', {
                url    : '/wiki',
                views  : {
                    'content@app.main': {
                        templateUrl: 'app/main/wiki/wiki.html',
                        controller : 'WikiController as vm'
                    }
                }
            });

       
    }
})();