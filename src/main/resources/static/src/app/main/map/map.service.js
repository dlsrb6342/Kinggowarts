(function ()
{
    'use strict';

    angular
        .module('app.core')
        .service('mapLocation', mapLocation);

    /** @ngInject */
    function mapLocation()
    {
        var service = this;
        //map에 진입시 항상 이 좌표, 줌으로 이동
        service.lastLat = 37.2939170;
        service.lastLng = 126.9753990;
        service.lastZoomLevel = 3;
        service.lastCategoryStatus = "none";
        //service.lastSelectedMarker = null;    //구현하려면 생성한 마커들 모두 저장해야함..
	
	
    }

})();