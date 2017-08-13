/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/main/notice/notice-navigation/notice-navigation.controller.js
*  Author     : underkoo
*  Description: notice-navigation 모듈 컨트롤러
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.main.notice.navigation')
        .controller('NoticeNavigationController', NoticeNavigationController);

    /** @ngInject */
    function NoticeNavigationController(
        /* 모듈 */
        $scope)
    {
        /* Data */
        var vm = this;
        vm.bodyEl = angular.element('body');
        vm.folded = false;
        vm.msScrollOptions = {
            suppressScrollX: true
        };

        /* 초기화 */
        /* Close the mobile menu on $stateChangeSuccess */
        $scope.$on('$stateChangeSuccess', function ()
        {
            vm.bodyEl.removeClass('ms-navigation-horizontal-mobile-menu-active');
        });

        /* Methods */
        /**********************************************************************//**
        Toggle folded status */
        vm.toggleMsNavigationFolded = function ()
        {
            vm.folded = !vm.folded;
        }

    }

})();