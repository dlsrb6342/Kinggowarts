(function ()
{
    'use strict';

    angular
        .module('app.core')
        .service('mapApiService', mapApiService);

    /** @ngInject */
    function mapApiService()
    {
        var service = this;
        
        //object
        function commKMarker(id, title, center, categoriesArr, region, tagsArr){
            this.id = id;           //id
            this.title = title;       //title TMP
            this.center = center;
            this.categoriesArr = categoriesArr;   //marker's category
            this.tagsArr = tagsArr;
            this.region = region;
        };

        //nMarkerTitleToKMarkerMappingObj, categoriesToKMarkerMappingObj, kMarkerStorageArr, kMarkersOnMap, CategoryMenuData, kMarkerData,
        
        //basic
        service.nMarkerTitleToKMarkerMappingObj = null;
        service.categoriesToKMarkerMappingObj = null;
        service.kMarkerStorageArr = null;
        service.kMarkersOnMap = null;
        service.CategoryMenuData = null;
        service.mapControllerDrawingManager = null;

        //service.kMarkerData = null;

        //comm

        //methods
        service.init = init;
	    
        //TODO : array 초기화 length로 
        function init(nMarkerTitleToKMarkerMappingObj, categoriesToKMarkerMappingObj, kMarkerStorageArr, kMarkersOnMap, CategoryMenuData){
            service.nMarkerTitleToKMarkerMappingObj = nMarkerTitleToKMarkerMappingObj;
            service.categoriesToKMarkerMappingObj = categoriesToKMarkerMappingObj;
            service.kMarkerStorageArr = kMarkerStorageArr;
            service.kMarkersOnMap = kMarkersOnMap;
            service.CategoryMenuData = CategoryMenuData;
            service.mapControllerDrawingManager = mapControllerDrawingManager;
        };

        //http
        function postMarkerDetailHttp(inData){
            if(inData.hasOwnProperty('id')){
                delete inData["id"];
            }
            return $http({
                method: 'POST',
                url: './api/map',
                data : JSON.stringify(inData),
                headers: {'x-auth-token': $sessionStorage.get('AuthToken'),
                        },
                transformResponse: [function (data) {
                    return data;
                }]
            });
        };
        function putMarkerDetailHttp(inData){
            var putid = inData["id"];
            delete inData["id"];
            return $http({
                method: 'PUT',
                //url: './api/map' + '/' + putid,
                data : JSON.stringify(inData),
                headers: {'x-auth-token': $sessionStorage.get('AuthToken'),
                        },
                transformResponse: [function (data) {
                    return data;
                }]
            });
        };
        function deleteMarkerHttp(inData){
            var delid = inData["id"];
            return $http({
                method: 'DELETE',
                url: './api/map' + '/' + delid,
                headers: {'x-auth-token': $sessionStorage.get('AuthToken') },
                transformResponse: [function (data) {
                    return data;
                }]
            });
        };

        function postMarkerDetail(inData){     //inData : commKMarker
            //add drawing data into indata
            var tempdrawingOverlays = mapControllerDrawingManager.getDrawings();
            for(var key in tempdrawingOverlays){
                if(tempdrawingOverlays[key].name == "marker"){
                    var latlng = tempdrawingOverlays[key].getOptions('position');
                    inData.center = latlng; //center setting from drawing
                }
                if(tempdrawingOverlays[key].name == "polygon"){
                    var pathArr = tempdrawingOverlays[key].getOptions('path');
                    inData.region = pathArr;
                }
            }

            if(inData.region == null || inData.region.length == 0){
                //retion empty
            }

            var inDataId = 0;   //TODO : get id from server
            inData.id = inDataId;

            $rootScope.$broadcast('ToMain', {
                type : 'api',
                apiType : 'create',
                result : 'success',
                data : inData
            });
            $rootScope.$broadcast('ToSide', {
                type : 'api',
                apiType : 'create',
                result : 'success',
                data : inData
            });

            /*
            var respo = postMarkerDetailHttp(inData);
            respo.then(
                function successFunc(response){

                    if(response.data == "duplicatedName"){
                        alert('중복된 이름입니다. 다른 이름을 설정하세요');
                    }
                    else if(response.data == "notAllowed"){
                        alert('notAllowed');
                    }
                    else if(response.data == "success"){
                        var inDataId = 0;   //TODO : get id from server
                        inData.id = inDataId;

                        $rootScope.$broadcast('ToMain', {
                            type : 'api'
                            apiType : 'create'
                            result : 'success'
                            data : inData
                        });

                        $rootScope.$broadcast('ToSide', {
                            type : 'api'
                            apiType : 'create'
                            result : 'success'
                            data : inData
                        });
                    }
                },
                 function failFunc(response){
                    console.log(response);
                });
                */
        }


        //put process
        function putMarkerDetail(inData, kMarkerData){      //commKMarker & kMarker
            //데이터 변경을 위한 statue 전환.
            var respo = putMarkerDetailHttp(inData);
            respo.then(
                function successFunc(response){
                    if(response.data == "duplicatedName"){
                        alert('중복된 이름입니다. 다른 이름을 설정하세요');
                    }
                    else if(response.data == "notAllowed"){
                        alert('notAllowed');
                    }
                    else if(response.data == "success"){
                        var originTitleInKMarkerData = kMarkerData.getTitle();
                        $rootScope.$broadcast('ToMain', {
                            type : 'api',
                            apiType : 'modify',
                            result : 'success',
                            data : inData,
                            originData : kMarkerData
                        });

                        $rootScope.$broadcast('ToSide', {
                            type : 'api',
                            apiType : 'modify',
                            result : 'success',
                            data : inData,
                            originData : kMarkerData
                        });   

                    }
                    else if(response.data == "noLocation"){
                        alert('수정하려는 지역이 존재하지 않습니다.');
                        //TODO : need refresh
                    }
                    else{
                        console.log("modifyMarkerDetail undefined response");
                        console.log(response.data);
                    }
                    //console.log("asdf");
                },
                 function failFunc(response){
                    console.log(response);
                });
        };

        //커스텀 지역 내용 수정 Process.
        function deleteMarkerDetail(kMarkerData){
            //데이터 변경을 위한 statue 전환.
            var respo = deleteMarkerHttp(kMarkerData);
            respo.then(
                function successFunc(response){
                    if(response.data == "noLocation"){
                        alert('수정하려는 지역이 존재하지 않습니다.');
                        refreshRegionData("regions");
                    }
                    else if(response.data == "notAllowed"){
                        alert('notAllowed');
                    }
                    else if(response.data == "success"){
                        $rootScope.$broadcast('ToMain', {
                            type : 'api',
                            apiType : 'delete',
                            result : 'success',
                            data : kMarkerData,
                        });

                        $rootScope.$broadcast('ToSide', {
                            type : 'api',
                            apiType : 'delete',
                            result : 'success',
                            data : kMarkerData,
                        });   
                    }
                },
                 function failFunc(response){
                    console.log(response);
                });
        };
    }

})();