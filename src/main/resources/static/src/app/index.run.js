/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/index.run.js
*  Author     : underkoo
*  Description: angular 모듈 running
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('kinggowarts')
        .run(runBlock);

    /** @ngInject */
    function runBlock(
        /* 모듈 */
        $rootScope, 
        $state, 
        $sessionStorage, 
        $timeout)
    {
        /* state 변경시 로딩 화면 활성화 */
        var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (evt, toState)
        {
            $rootScope.numResolveData = 0;
            $rootScope.loadingData = 0;
            if (toState.resolve != undefined) $rootScope.numResolveData = Object.keys(toState.resolve).length;

            if( (toState.name != 'app.login' && toState.name != 'app.findpw' && toState.name != 'app.register') && $sessionStorage.get('useremail') == undefined)
            {
                alert('로그인 되어 있지 않거나 세션 유효기간이 끝나 로그아웃 되었습니다.');
                evt.preventDefault();
                $state.go('app.login');
            }

            if( (toState.name == 'app.login' || toState.name == 'app.findpw' || toState.name == 'app.register') && $sessionStorage.get('useremail') != undefined)
            {
                evt.preventDefault();
                $state.go('app.main.map');
            }

            $rootScope.loadingProgress = true;
            $rootScope.$broadcast('msSplashScreen::add');
        });

        /* state 변경 완료시 로딩 화면 비활성화 */
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function ()
        {
            $timeout(function ()
            {
                $rootScope.loadingProgress = false;
            });
            $rootScope.$broadcast('msSplashScreen::remove');
        });

        /* rootScope 모듈에 현재 state 저장. */
        $rootScope.state = $state;

        /* Cleanup */
        $rootScope.$on('$destroy', function ()
        {
            stateChangeStartEvent();
            stateChangeSuccessEvent();
        });
    }
})();
