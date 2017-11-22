(function ()
{
    'use strict';

    angular
        .module('app.core')
        .service('mapApiService', mapApiService);

    /** @ngInject */
    function mapApiService($rootScope, $http, $sessionStorage)
    {
        var service = this;
        
        //object
        function commKMarker(id, title, center, categoriesArr, region, tagsArr, detail, campusType){
            this.id = id;           //id
            this.title = title;       //title TMP
            this.center = center;       //naver latlng : {_lat, _lng}
            this.categoriesArr = categoriesArr;   //marker's Category : ["catname"]
            this.tagsArr = tagsArr;     // : ["tag1", "tag2, .."]
            this.region = region;       // naver latlng arr : [{_lat, _lng}, {_lat, _lng}, {_lat, _lng}... ]
            this.detail = detail;
            this.campusType = campusType;
        };
        commKMarker.prototype.setRegion = function(region){
            this.region = region;
        };
        commKMarker.prototype.setTagsArr = function(tagsArr){
            this.tagsArr = tagsArr;
        };
        commKMarker.prototype.makeCommAPIMarker = function(){
            var retCommAPIMarker = new commAPIMarker(
                this.id,
                this.title,
                {"lat" : this.center._lat, "lng" : this.center._lng},
                {"name" : this.categoriesArr[0], "type" : this.campusType},
                [],   //path
                [],   //tags
                this.detail,
                "user"  //default
            );
            if(this.region != null && this.region.length != 0){
                var tempPath = [];
                for(var i=0, ii = this.region.length; i<ii; i++){
                    tempPath.push({"lat" : this.region[i]._lat, "lng" : this.region[i]._lng});
                }
                retCommAPIMarker.setPath(tempPath);
            }
            if(this.tagsArr != null && this.tagsArr.length != 0){
                var tempTags = [];
                for(var i=0, ii = this.tagsArr.length; i<ii; i++){
                    tempTags.push({"name" : this.tagsArr[i]});
                }
                retCommAPIMarker.setTags(tempTags);
            }
            return retCommAPIMarker;
        };

        function commAPIMarker(id, name, center, markerCategory, path, tags, detail, type){
            this.id = id;           //id
            this.name = name;       //title TMP
            this.center = center;       //latlng : {lat, lng}
            this.detail = "";
            this.markerCategory = markerCategory;   //marker's Category : [{"name" : "catname", "type" : "M or Y"}]
            this.tags = tags;     // : [{"name : tag1"}, {"name" : tag2}, .."]
            this.path = path;       // polygon path : [{lat, lng}, {lat, lng}, {lat, lng}... ]
            this.detail = detail;
            this.type = type; //default user value
        };
        commAPIMarker.prototype.setTags = function(tags){
            this.tags = tags;
        };
        commAPIMarker.prototype.setPath = function(path){
            this.path = path;
        };
        commAPIMarker.prototype.makeCommKMarker = function(){
            var retCommKMarker = new commKMarker(
                this.id,
                this.name,
                this.center = new naver.maps.LatLng(this.center.lat, this.center.lng),
                [this.markerCategory.name],   //category
                null,   //region
                [],    //tags
                this.detail,
                this.markerCategory.type
            );
            if(this.path != null && this.path.length != 0){
                var tempRegion = [];
                for(var i=0, ii = this.path.length; i<ii; i++){
                    tempRegion.push(new naver.maps.LatLng(this.path[i].lat, this.path[i].lng));
                }
                retCommKMarker.setRegion(tempRegion);
            }
            if(this.tags != null && this.tags.length != 0){
                var tempTagsArr = [];
                for(var i=0, ii = this.tags.length; i<ii; i++){
                    tempTagsArr.push(this.tags[i].name);
                }
                retCommKMarker.setTagsArr(tempTagsArr);
            }
            return retCommKMarker;
        };



        //nMarkerTitleToKMarkerMappingObj, categoriesToKMarkerMappingObj, kMarkerStorageArr, kMarkersOnMap, CategoryMenuData, kMarkerData,
        
        //basic
        service.nMarkerTitleToKMarkerMappingObj = null;
        service.categoriesToKMarkerMappingObj = null;
        service.kMarkerStorageArr = null;
        service.kMarkersOnMap = null;
        service.CategoryMenuData = null;
        service.mapControllerDrawingManager = null;

        //function
        service.getMarkerDetail = getMarkerDetail;
        service.postMarkerDetail = postMarkerDetail;
        service.putMarkerDetail = putMarkerDetail;
        service.deleteMarkerDetail = deleteMarkerDetail;

        //service.kMarkerData = null;

        //comm

        //methods
        service.init = init;
	    
        function init(nMarkerTitleToKMarkerMappingObj, categoriesToKMarkerMappingObj, kMarkerStorageArr, kMarkersOnMap, CategoryMenuData, mapControllerDrawingManager){
            service.nMarkerTitleToKMarkerMappingObj = nMarkerTitleToKMarkerMappingObj;
            service.categoriesToKMarkerMappingObj = categoriesToKMarkerMappingObj;
            service.kMarkerStorageArr = kMarkerStorageArr;
            service.kMarkersOnMap = kMarkersOnMap;
            service.CategoryMenuData = CategoryMenuData;
            service.mapControllerDrawingManager = mapControllerDrawingManager;
        };

        //http
        function getMarkerDetailHttp(inData){
            var tempUrl = './api/marker' + '?' + "type=" + inData.type + "&" + "q=" + inData.q;
            console.log(tempUrl);
            return $http({
                method: 'GET',
                url: tempUrl,
                //data : JSON.stringify(inData),
                headers: {'x-auth-token': $sessionStorage.get('AuthToken'),
                        },
                transformResponse: [function (data) {
                    if(data == ""){
                        return JSON.parse("null");
                    }
                    return JSON.parse(data);
                }]
                
            });
        }

        function postMarkerDetailHttp(inData){
            if(inData.hasOwnProperty('id')){
                delete inData["id"];
            }
            return $http({
                method: 'POST',
                url: './api/marker',
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
                url: './api/marker' + '/' + putid,
                data : JSON.stringify(inData),
                headers: {'x-auth-token': $sessionStorage.get('AuthToken'),
                        },
                transformResponse: [function (data) {
                    return data;
                }]
            });
        };
        function deleteMarkerDetailHttp(inData){
            var delid = inData["id"];
            return $http({
                method: 'DELETE',
                url: './api/marker' + '/' + delid,
                headers: {'x-auth-token': $sessionStorage.get('AuthToken') },
                transformResponse: [function (data) {
                    return data;
                }]
            });
        };

        function getMarkerDetail(q, type, markerOn){
            var args = {"q" : q, "type" : type};
            var respo = getMarkerDetailHttp(args);
            respo.then(
                function successFunc(response){
                    console.log(response);
                    var dataList = [];
                    if(response.data == null){
                        $rootScope.$broadcast('ToMain', {
                            type : 'api',
                            apiType : 'get',
                            result : 'success',
                            data : dataList,
                            categoryType : q,
                            campusType : type,
                            isWantMarkerOn : markerOn
                        });
                    }
                    else{
                        for(var i=0, ii= response.data.length; i<ii; i++){
                            var tempData = response.data[i];
                            var tempCommAPIMarker = new commAPIMarker(
                                tempData.id,
                                tempData.name,
                                tempData.center,
                                {"name" : q, "type" : type},
                                tempData.path,
                                tempData.tags,
                                tempData.detail
                            );
                            dataList.push(tempCommAPIMarker.makeCommKMarker());
                        }
                        console.log(dataList);
                        
                        $rootScope.$broadcast('ToMain', {
                            type : 'api',
                            apiType : 'get',
                            result : 'success',
                            data : dataList,
                            categoryType : q,
                            campusType : type,
                            isWantMarkerOn : markerOn
                        });
                    }
                },
                 function failFunc(response){
                    console.log(response);
                }
            );
        }

        function postMarkerDetail(inData){     //inData : commKMarker
            //add drawing data into indata
            var tempdrawingOverlays = service.mapControllerDrawingManager.getDrawings();
            var isHasPolygon = false;
            var isHasMarker = false;
            for(var key in tempdrawingOverlays){
                if(tempdrawingOverlays[key].name == "marker"){
                    var latlng = tempdrawingOverlays[key].getOptions('position');
                    inData.center = latlng; //center setting from drawing
                    isHasMarker = true;
                }
                if(tempdrawingOverlays[key].name == "polygon"){
                    var pathArr = tempdrawingOverlays[key].getOptions('paths');
                    inData.region = pathArr.getAt(0).getArray();
                    isHasPolygon = true;
                }
            }
            if(isHasMarker == false){
                alert('마커를 반드시 생성해야합니다.');
                return;
            }

            if(isHasPolygon == false){
                inData.region = null;
            }
            console.log(inData.makeCommAPIMarker());
            var respo = postMarkerDetailHttp(inData.makeCommAPIMarker());
            respo.then(
                function successFunc(response){
                    //response.data = {"success : true, id : x"}
                    console.log(response);
                    var responseData = JSON.parse(response.data);
                    inData.id = responseData.id;
                    if(responseData.success){
                        $rootScope.$broadcast('ToMain', {
                            type : 'api',
                            apiType : 'create',
                            result : 'success',
                            data : inData
                        });
                    }
                    else{
                        //fail & error
                        $rootScope.$broadcast('ToMain', {
                            type : 'api',
                            apiType : 'create',
                            result : 'fail',
                            error : responseData.error,
                            data : inData
                        });
                    }
                    
                },
                 function failFunc(response){
                    console.log(response);
                });
                
        }


        //put process
        function putMarkerDetail(inData, kMarkerData){      //commKMarker & kMarker
            var tempdrawingOverlays = service.mapControllerDrawingManager.getDrawings();
            var isHasPolygon = false;
            var isHasMarker = false;
            for(var key in tempdrawingOverlays){
                if(tempdrawingOverlays[key].name == "marker"){
                    var latlng = tempdrawingOverlays[key].getOptions('position');
                    inData.center = latlng; //center setting from drawing
                    isHasMarker = true;
                }
                if(tempdrawingOverlays[key].name == "polygon"){
                    var pathArr = tempdrawingOverlays[key].getOptions('paths');
                    inData.region = pathArr.getAt(0).getArray();
                    isHasPolygon = true;
                }
            }
            if(isHasMarker == false){
                alert('마커를 반드시 생성해야합니다.');
                return;
            }

            if(isHasPolygon == false){
                inData.region = null;
            }
            console.log(inData.makeCommAPIMarker());
            var respo = putMarkerDetailHttp(inData.makeCommAPIMarker()); //trans to commapimarker
            respo.then(
                function successFunc(response){
                    console.log(response);
                    /*
                    $rootScope.$broadcast('ToMain', {
                        type : 'api',
                        apiType : 'modify',
                        result : response.data,
                        data : inData, 
                        originData : kMarkerData
                    });
                    }*/
                    $rootScope.$broadcast('ToMain', {
                        type : 'api',
                        apiType : 'modify',
                        result : 'success',
                        data : inData, 
                        originData : kMarkerData
                    });
                },
                 function failFunc(response){
                    console.log(response);
                }
            );
        };

        //커스텀 지역 내용 수정 Process.
        function deleteMarkerDetail(kMarkerData){
            var respo = deleteMarkerDetailHttp(kMarkerData);
            respo.then(
                function successFunc(response){
                    console.log(response);
                    /*if(responseData.success){
                        $rootScope.$broadcast('ToMain', {
                            type : 'api',
                            apiType : 'delete',
                            result : 'success',
                            originData : kMarkerData
                        });
                    }
                    else{
                        $rootScope.$broadcast('ToMain', {
                            type : 'api',
                            apiType : 'delete',
                            result : 'fail',
                            error : responseData.error,
                            originData : kMarkerData
                        });
                    }*/
                    $rootScope.$broadcast('ToMain', {
                        type : 'api',
                        apiType : 'delete',
                        result : 'success',
                        originData : kMarkerData
                });
                },
                 function failFunc(response){
                    console.log(response);
                });
            

            
            //데이터 변경을 위한 statue 전환.
            /*var respo = deleteMarkerDetailHttp(kMarkerData);
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
                */
        };

    }

})();