/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/main/main.module.js
*  Author     : underkoo
*  Description: main 모듈 정의
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.main', [

            // Toolbar
            'app.main.toolbar',

            // Quick Panel
            'app.main.quick-panel',

            //daum map module
            'app.main.map',

            //wiki module
            'app.main.wiki',

            //notice module
            'app.main.notice',

            ])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider
            .state('app.main', {
                abstract: true,
                views   : {
                    'main@'         : {
                        templateUrl: 'app/main/main.html',
                        controller : 'MainController as vm'
                    },
                    'toolbar@app.main'   : {
                        templateUrl: 'app/main/toolbar/layouts/toolbar.html',
                        controller : 'ToolbarController as vm'
                    },
                    'quickPanel@app.main': {
                        templateUrl: 'app/main/quick-panel/quick-panel.html',
                        controller : 'QuickPanelController as vm'
                    }
                }
            });
    }
})();