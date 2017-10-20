(function ()
{
    'use strict';

    angular
        .module('app.core')
        .service('sideMapCommService', sideMapCommService);

    /** @ngInject */
    function sideMapCommService()
    {
        var service = this;
        
        //nMarkerTitleToKMarkerMappingObj, categoriesToKMarkerMappingObj, kMarkerStorageArr, kMarkersOnMap, CategoryMenuData, kMarkerData,
        
        //basic
        //service.nMarkerTitleToKMarkerMappingObj = null;
        //service.categoriesToKMarkerMappingObj = null;
        //service.kMarkerStorageArr = null;
        //service.kMarkersOnMap = null;
        service.CategoryMenuData = null;
        //service.kMarkerData = null;

        //comm
        service.bSideOpen = false;
        service.kMarkerResolvedArr = [];


        //methods
        service.startSideBar = function(inKMarkerArr){
            service.kMarkerResolvedArr = inKMarkerArr;
            //console.log("startSideBar func");
            //service.bSideOpen = true;
        }

    }

})();