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
        
        //nMarkerTitleToKMarkerMappingObj, categoriesToKMarkerMappingObj, kMarkerStorageArr, kMarkersOnMap, CategoryMenuData, kMarkerData,
        
        //basic
        service.nMarkerTitleToKMarkerMappingObj = null;
        service.categoriesToKMarkerMappingObj = null;
        service.kMarkerStorageArr = null;
        service.kMarkersOnMap = null;
        service.CategoryMenuData = null;

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
        };

        //http
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

        //put process
        function putMarkerDetail(inData, kMarkerData){
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
                        //TODO : success
                        //title, category, tags

                        //mapping 해제
                        delete service.markerTitleToKMarkerMappingObj[kMarkerData.getTitle()];
                        var tempKMarkerCategoriesArr = kMarkerData.getCategoriesArr();
                        for(var i = 0, ii = tempKMarkerCategoriesArr.length; i<ii; i++){
                            var tempKMarkerInnerObjArr = service.categoriesToKMarkerMappingObj[tempKMarkerCategoriesArr[i].title].kMarker;
                            for(var j =0 , jj = tempKMarkerInnerObjArr.length; j<jj; j++){
                                if(tempKMarkerInnerObjArr[j] == kMarkerData){
                                //if(tempKMarkerInnerObjArr[j].getTitle() == kMarkerData.getTitle())
                                    splice(tempKMarkerInnerObjArr(j,j));
                                    break;  //한개의 kMarker만 존재 할 것이므로
                                }
                            }
                        }                       
                        //mapping register
                        service.markerTitleToKMarkerMappingObj[kMarkerData.getTitle()] = kMarker;
                        for(var i = 0, ii = inData.categoriesArr.length; i<ii; i++){
                            //service.categoriesToKMarkerMappingObj[inData.categoriesArr[i]] == innerMappingObj
                            service.categoriesToKMarkerMappingObj[inData.categoriesArr[i]].getKMarkersArr().push(newKMarker);;
                        }




                        

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
        function deleteMarker(inData, kMarkerData){
            //데이터 변경을 위한 statue 전환.
            var respo = deleteMarkerHttp(inData);
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
                        kMarkerData.unsetOnMap();   //nMarker Unset
                        kMarkerData.unsetPolyOnMap();

                        //service.kMarkerStorageArr, service.kMarkersOnMap delete
                        for(var i = 0, ii = service.kMarkerStorageArr.length; i<ii; i++){
                            //if(service.kMarkerStorageArr[j].getTitle() == kMarkerData.getTitle())
                            if(service.kMarkerStorageArr[i] == kMarkerData){
                                service.kMarkerStorageArr.splice(i,i);
                                break;
                            }
                        }
                        for(var i = 0, ii = service.kMarkersOnMap.length; i<ii; i++){
                            //if(service.kMarkerStorageArr[j].getTitle() == kMarkerData.getTitle())
                            if(service.kMarkersOnMap[i] == kMarkerData){
                                service.kMarkersOnMap.splice(i,i);
                                break;
                            }
                        }

                        //mapping 해제
                        delete service.markerTitleToKMarkerMappingObj[kMarkerData.getTitle()];
                        var tempKMarkerCategoriesArr = kMarkerData.getCategoriesArr();
                        for(var i = 0, ii = tempKMarkerCategoriesArr.length; i<ii; i++){
                            var tempKMarkerInnerObjArr = service.categoriesToKMarkerMappingObj[tempKMarkerCategoriesArr[i].title].kMarker;
                            for(var j =0 , jj = tempKMarkerInnerObjArr.length; j<jj; j++){
                                if(tempKMarkerInnerObjArr[j] == kMarkerData){
                                //if(tempKMarkerInnerObjArr[j].getTitle() == kMarkerData.getTitle())
                                    tempKMarkerInnerObjArr.splice(j,j);
                                    break;  //한개의 kMarker만 존재 할 것이므로
                                }
                            }
                        }

                        $mdDialog.hide(
                            {
                                'kMarker' : kMarkerData,
                                'respond' : 'delete'
                            }
                        );
                    }
                },
                 function failFunc(response){
                    console.log(response);
                });
        };
    }

})();