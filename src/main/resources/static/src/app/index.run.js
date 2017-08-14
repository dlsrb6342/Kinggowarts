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

            if( (toState.name != 'app.login' && toState.name != 'app.register') && $sessionStorage.get('useremail') == undefined)
            {
                alert('로그인 되어 있지 않거나 세션 유효기간이 끝나 로그아웃 되었습니다.');
                evt.preventDefault();
                $state.go('app.login');
            }
            $rootScope.loadingProgress = true;
        });

        /* state 변경 완료시 로딩 화면 비활성화 */
        var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function ()
        {
            $timeout(function ()
            {
                $rootScope.loadingProgress = false;
            });
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
