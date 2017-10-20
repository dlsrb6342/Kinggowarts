/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/core/directives/ms-fade/ms-fade.directive.js
*  Author     : HongGiwon
*  Description: 
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.core')

        .directive('msFade', msFadeDirective);

    /** @ngInject */
    function msFadeDirective()
    {
        return {
            restrict: 'A',
            link: function($scope, $element, attrs){
                $element.addClass("ng-hide-remove");
                $element.on('load', function() {
                    $element.addClass("ng-hide-add");
                });
            }
        };
    }

})();
