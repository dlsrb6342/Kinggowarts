(function ()
{
    'use strict';

    angular
        .module('app.register',
                 ['flow'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider,msNavigationServiceProvider)
    {
        // State
        
        $stateProvider
            .state('register', {
                url: '/register',
                views: {
                    
                    'main@' : {
                        templateUrl: 'app/main/register/register.html',
                        controller: 'RegisterController as vm'
                    }
                    
                }
            });

       
    }

})();
