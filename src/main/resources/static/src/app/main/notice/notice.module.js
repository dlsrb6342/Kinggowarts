(function ()
{
    'use strict';

    angular
        .module('app.notice', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.notice', {
                url    : '/notice',
                views  : {
                    'content@app': {
                        templateUrl: 'app/main/notice/notice.html',
                        controller : 'NoticeController as vm'
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