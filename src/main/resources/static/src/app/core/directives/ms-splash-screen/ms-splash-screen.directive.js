(function ()
{
    'use strict';

    angular
        .module('app.core')
        .directive('msSplashScreen', msSplashScreenDirective);

    /** @ngInject */
    function msSplashScreenDirective($animate)
    {
        return {
            restrict: 'E',
            link    : function (scope, iElement)
            {
                var parent = iElement.parent();

                var splashScreenRemoveEvent = scope.$on('msSplashScreen::remove', function ()
                {
                    $animate.leave(iElement);
                    /*
                    $animate.leave(iElement).then(function ()
                    {
                        // De-register scope event
                        splashScreenRemoveEvent();

                        // Null-ify everything else
                        //scope = iElement = null;
                    });
                    */
                });
                
                //splashScreen 추가 event
                var splashScreenAddEvent = scope.$on('msSplashScreen::add', function ()
                {
                    $animate.enter(iElement, parent);
                    /*
                    $animate.enter(iElement, parent).then(function ()
                    {
                        //event 추가
                        splashScreenAddEvent();

                    });
                    */
                });
                
            }
        };
    }
})();