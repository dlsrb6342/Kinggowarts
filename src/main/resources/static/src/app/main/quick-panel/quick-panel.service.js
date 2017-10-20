/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/main/quick-panel/quick-panel.service.js
*  Author     : HongGiwon
*  Description: quick-panel과 map이 peer에 대한 정보를 공유하기 위한 service.
                src/app/core/directives/ms-quickpanel/ms-quickpanel.directive.js의 QuickPanelPeerController에서 사용함.
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.core')
        .service('peerLocation', peerLocation);

    /** @ngInject */
    function peerLocation()
    {
        var service = this;
        service.peer = '';
        service.modified = 0;
    }

})();