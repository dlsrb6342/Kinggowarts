(function ()
{
    'use strict';

    angular
        .module('app.login', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.login', {
                url      : '/login?auth',
                views    : {
                    'main@' : {
                        templateUrl: 'app/login/login.html',
                        controller : 'LoginController as vm'
                    }
                }
            });
    }

})();