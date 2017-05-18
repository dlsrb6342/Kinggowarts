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

        /*
        peerLocation.peer.location["ST"]로 학생 접근. n은 index
        ex) peerLocation.peer.location["ST"][n].name -> 이름
            peerLocation.peer.location["ST"][n].checked -> true면 표시
            peerLocation.peer.location["ST"][n].locationx -> x좌표
            peerLocation.peer.location["ST"][n].locationy -> y좌표
            peerLocation.peer.location["ST"][n].avatar -> 이미지 src

        peerLocation.peer.location["PF"]로 교수 접근.

        for in으로 접근하면 편함 quick-panel-controller 41줄 참고
        */
    }

})();