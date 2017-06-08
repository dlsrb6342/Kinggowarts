(function ()
{
    'use strict';


    angular
        .module('app.map')
        .controller('MapController', MapController);


    /** @ngInject */
    function MapController(MBusstop, MShelter, MMarket, MPrinter, MCafe, MInEat, MInRest, MOutRest, MATM, CategoryTypes, $rootScope, $q, AreaUser, AreaAdmin, $http, $httpParamSerializerJQLike, $mdDialog, DrawingMenuData, CustomEventData, CategoryMarkerData, $scope, $interval, $timeout, peerLocation, mapLocation, $sessionStorage, $state)
    {
        var vm = this;
        
        vm.clickName = "none"; //클릭한 구역 폴리곤(area)의 name
        vm.clickUrl =  '../xwiki/bin/view/XWiki/';

        //vm.userLat = 0;   mapLocation.userLastLat
        //vm.userLng = 0;   mapLocation.userLastLng
        vm.curMapLevel = 2;     //현재 지도의 zoom level
        vm.lidForEvent = -1;
        vm.eventDataId = -1;
        //category status type : {bank, toilet, print, busstop, vendingmachine}, {insideRestaurant, outsideRestaurant}, {standard, engineer, comm, soft}, group, region
        vm.categoryStatus = "none";
        //var categoryTypes = ["bank", "toilet", "busstop", "print", "vendingmachine", "insideRestaurant", "customevent", "regions"];
        var categoryTypes = CategoryTypes.data;
        var markerDataSkeleton = initAllMarkerData();
        vm.markerData = markerDataSkeleton;
        //markerDataSkeleton = MarkerData;

        var areaAdmin, areaUser;
        var subAreaData = makeSubAreaData(AreaAdmin, AreaUser);//GetSubAreaData();

        vm.customEventData = CustomEventData.data;
        vm.drawingMenuData = DrawingMenuData.data;
        vm.categoryMenu = CategoryMarkerData.data;
        vm.selectedCustomEventIdx = -1;
        vm.customEventDataOrderbyRegions = {};

        var disableAllListener = false;

        var isPeerOnMap = false;                //peer가 맵 위에 있는지 여부
        var peerOnMapCustomOverlays = [];       //현재 맵 위에 있는 peer custom overlay들.
        var peerOnMapTransparnetMarkers = [];   //현재 맵 위에 있는 투명 markers
        
        var container = document.getElementById('map');
        var options = {
            center: new daum.maps.LatLng(mapLocation.lastLat, mapLocation.lastLng),
            level: mapLocation.lastZoomLevel
        };
        var map = new daum.maps.Map(container, options);
        //mapLocation.map = map;


//----------------------------------------------------------------------
        var isModifyCustomEventInfo = false;    //event info 수정상태
        var isModifyCustomEventShape = false;   //event shape 수정상태
        
        var isModifyRegionShape = false;
        var isModifyRegionInfo = false;

        // 초기 resolve된 data 처리
        function initAllMarkerData(){
            var ret = {};

            for(var i=0; i<categoryTypes.length; i++){
                ret[categoryTypes[i]] = [];
            }
            ret = initMarkerData(MATM, ret);
            ret = initMarkerData(MPrinter, ret);
            ret = initMarkerData(MCafe, ret);
            ret = initMarkerData(MInRest, ret);
            ret = initMarkerData(MOutRest, ret);
            ret = initMarkerData(MInEat, ret);
            ret = initMarkerData(MBusstop, ret);
            ret = initMarkerData(MShelter, ret);
            ret = initMarkerData(MMarket, ret);

            return ret;
        }

        function initMarkerData(inData, ret){
            var data = inData.data;
            if(data.length != 0){
                ret[data[0]["markerCategory"]["name"]] = data;
            }
            return ret;
        }

        //모든 마커 초기화후 none으로.
        /*function refreshAllMarkerData(){
            var promArr = [];
            for(var i = 0; i<categoryTypes.length; i++){
                promArr[i] = GetCustomMarkerData(categoryTypes[i]);
            }
            //약속을 $q.all 메서드를 이용해 새로운 약속을 만든다.
            $q.all(promArr)
            .then(
                function(results) {
                //약속이 모두 지켜지면 asyncService서비스가 반한하는 약속을 지키고 두 약속이 전달하는 결과를 묶은 배열로 전달한다.
                    deferred.resolve(results);
                    areaAdmin = results[0];
                    areaUser = results[1];
                    for(var i=0; i<results.length; i++){
                        var data = results[i].data;
                        markerDataSkeleton[categoryTypes[i]] = [];
                        for(var k = 0; k < data.length; k++){
                            markerDataSkeleton[categoryTypes[i]][k] = data[k];
                        }
                    }
                    categoryStatusChangeProcess("none", true);
                    createCategoryMarkersInJson();
                    categoryStatusChangeProcess("none", false);
                },
                function(errors) {
                    deferred.reject(errors);
                },
                function(updates) {
                    deferred.update(updates);
            });
            resetMarkerData()
        }*/

        
        //로그인 되어있지 않은 사용자가 맵에 접근시 로그인 페이지로 돌려보냄
        
        function usercheck(){
            var userval = $sessionStorage.get('useremail');
            if(userval == undefined){
                alert('로그인 되어 있지 않거나 세션 유효기간이 끝나 로그아웃 되었습니다.');
                $state.go('login');
            }
        };
        usercheck();

        var customOverlay = new daum.maps.CustomOverlay({});
        var infowindow = new daum.maps.InfoWindow({removable: true});

        daum.maps.Tileset.add('TILE_NUMBER', 
        new daum.maps.Tileset({
            width: 256,
            height: 256,
            getTile: function(x, y, z) {
                if( (z== 1 && 3545 <= x && x <= 3567 && 7519 <= y && y <= 7536)||
                    (z == 3 && x >= 886 && x <= 892 && 1879 <= y && y <= 1883) || 
                    (z == 2 && 1772 <= x && x <= 1785 && 3758 <= y && y <= 3768)){
                    var div = document.createElement('div');

                    div.innerHTML = '<div><img src="assets/images/tileset/tileset_'+x+'_'+y+'_'+z+'.gif"></img></div>';
                    div.style.fontSize = '0px';
                    div.style.fontWeight = 'bold';
                    div.style.lineHeight = '0px';
                    div.style.textAlign = 'center';
                    div.style.color = '#4D4D4D';
                    div.style.border = '0px dashed #ff5050';
                    return div;
                }
                else{
                    var div = document.createElement('div');
                    div.innerHTML = '<div></div>';
                    return div;
                }
                
            }
        }));

        // 지도 위에 TILE_NUMBER 오버레이 레이어를 추가합니다
        map.addOverlayMapTypeId(daum.maps.MapTypeId.TILE_NUMBER);
        //-------------------------------custom evnet Drawing---------------------------------------
        
        var drawingManager = null;
        
        var drawCustomEvnetOptions = { // Drawing Manager를 생성할 때 사용할 옵션입니다
            map: map, // Drawing Manager로 그리기 요소를 그릴 map 객체입니다
            drawingMode: [ // Drawing Manager로 제공할 그리기 요소 모드입니다
                daum.maps.Drawing.OverlayType.MARKER,
                daum.maps.Drawing.OverlayType.POLYLINE,
                daum.maps.Drawing.OverlayType.RECTANGLE,
                daum.maps.Drawing.OverlayType.CIRCLE,
                daum.maps.Drawing.OverlayType.POLYGON
            ],
            // 사용자에게 제공할 그리기 가이드 툴팁입니다
            // 사용자에게 도형을 그릴때, 드래그할때, 수정할때 가이드 툴팁을 표시하도록 설정합니다
            guideTooltip: ['draw', 'drag', 'edit'], 
            markerOptions: { // 마커 옵션입니다 
                draggable: true, // 마커를 그리고 나서 드래그 가능하게 합니다 
                removable: true // 마커를 삭제 할 수 있도록 x 버튼이 표시됩니다  
            },
            rectangleOptions: {
                draggable: true,
                removable: true,
                editable: true,
                strokeColor: '#39f', // 외곽선 색
                fillColor: '#39f', // 채우기 색
                fillOpacity: 0.5 // 채우기색 투명도
            },
            circleOptions: {
                draggable: true,
                removable: true,
                editable: true,
                strokeColor: '#39f',
                fillColor: '#39f',
                fillOpacity: 0.5
            },
            polygonOptions: {
                draggable: true,
                removable: true,
                editable: true,
                strokeColor: '#39f',
                fillColor: '#39f',
                fillOpacity: 0.5,
                hintStrokeStyle: 'dash',
                hintStrokeOpacity: 0.5
            }
        };      
        // 위에 작성한 옵션으로 Drawing Manager를 생성합니다
        drawingManager = new daum.maps.Drawing.DrawingManager(drawCustomEvnetOptions);
        drawingManager.addListener('select', function(data) {
            disableAllMarkerListener();
        });
        drawingManager.addListener('cancel', function(data) {
            enableAllMarkerListener();
        });

        var customEventShapes = []; //customEvent region 도형들을 담는다.
        var regionShapes = [];


        //선택된 이벤트 도형을 수정 가능상태로 만들기.
        function modifyShape(inData){
            //inData = vm.markerData["regions"][selectedMarkerIdx]
            disableAllMarkerListener();
            var curIdx = selectedMarkerIdx;
            
            //layout set null
            if(vm.categoryStatus == "customevent"){
            }
            else if(vm.categoryStatus == "regions"){
                regionShapes[curIdx].setMap(null);
            }
            
            //마커 삭제 불가능하게 하려 했는데 setStyle 함수 호출 에러..
            //drawingManager.setStyle(daum.maps.drawing.OverlayType.Marker, 'removable', 'false');

            //layout으로 부터 정보를 얻기 힘드므로 vm.markerData에서 얻음.
            addDataToDrawingManager(vm.markerData[vm.categoryStatus][curIdx]);
            
        };

        //수정된 커스텀 이벤트 도형 save
        function updateShape(){
            var modifyingData = vm.markerData[vm.categoryStatus][selectedMarkerIdx];
            //custom event data(detail) -> event data(detail + shape&marker)
            var newCustomEventObj = removeOverlayAndGetData(modifyingData);
            var tempStatus = vm.categoryStatus;

            var respo = PutAreaUser(modifyingData);
            respo.then(
                function successFunc(response){
                    if(response.data == "duplicatedName"){
                        alert('중복된 이름입니다. 다른 이름을 설정하세요');
                    }
                    else if(response.data == "notAllowed"){
                        alert('notAllowed');
                    }
                    else if(response.data == "success"){
                        refreshRegionData(tempStatus);   //refresh region & goto state
                    }
                    else if(response.data == "noLocation"){
                        alert('수정하려는 지역이 존재하지 않습니다.');
                        refreshRegionData(tempStatus);
                    }
                    //console.log("asdf");
                },
                 function failFunc(response){
                    console.log(response);
                });
            
            isModifyCustomEventShape = false;   //수정 종료
            isModifyRegionShape = false;
            enableAllMarkerListener();
        };

    //----------------------------Region 내용 생성 / 수정----------------

        //var isModifyRegionshape = false;
        //var isModifyRegionInfo = false;
        
        //Region 내용 생성 / 수정 다이얼로그
        function showCreateRegionDialog(ev) {
            $mdDialog.show({
                controller: CreateRegionDialogController,
                templateUrl: 'app/main/map/dialogCreateRegion.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: false, // Only for -xs, -sm breakpoints.
                resolve:{
                    modifiedData : function(){
                        if(isModifyRegionInfo == true)
                            return vm.markerData["regions"][selectedMarkerIdx];
                        else
                            return null;
                    }
                }
            })
            .then(function(answer) {
                if(isModifyRegionInfo == false){
                    makeRegionDetail(answer);
                }
                else{
                    modifyRegionDetail(answer);
                }
            }, function() {
                isModifyRegionInfo = false;    // modify mode 해제
            });
        };

        //Region 내용 생성/ 수정 컨트롤러
        function CreateRegionDialogController($scope, $mdDialog, modifiedData) {
            //modify를 위한 dialog 생성.
            if(isModifyRegionInfo == true){
                $scope.isModify = true; //dialog에서 create/detail 상태에 따른 제목 수정
                $scope.retData = modifiedData;
            }
            else{
                $scope.isModify = false;
                $scope.retData = 
                {
                    "name": "",
                    "center": {
                          "lng": "0.0",
                          "lat": "0.0"//,
                          //"center" : "0.0"
                    },
                    "type" : "user",
                    "shape" : "",
                    "detail" : "",
                    "tags" : [],
                    "path" : []
                };
            }
            
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function() {
                $mdDialog.hide($scope.retData);
            };
            $scope.newTag = function(chip)
             {
                 return { name : chip };
             };
        }

    //-------------region 내용 다이얼로그-------------------------
        //region 내용을 보여주는 다이얼로그
        function showRegionDialog(ev) {
            $mdDialog.show({
                controller: RegionDialogController,
                templateUrl: 'app/main/map/dialogRegion.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: false, // Only for -xs, -sm breakpoints.
                resolve: {
                    regionData : function(){
                        return vm.markerData["regions"][selectedMarkerIdx];
                    }
                }
            })
            .then(function(answer) {
                if(answer == "modifyShape"){
                    isModifyRegionShape = true;
                    modifyShape(vm.markerData["regions"][selectedMarkerIdx]);
                }
                else if(answer == "modifyInfo"){
                    isModifyRegionInfo = true;
                    showCreateRegionDialog();
                }
                else if(answer == "delete"){
                    deleteRegion(vm.markerData["regions"][selectedMarkerIdx]);
                }

            }, function() {
                //alert('none..');
            });
        };

        // Region의 내용을 보여주는 다이얼로그 컨트롤러
        function RegionDialogController($scope, $mdDialog, regionData) {
            $scope.data = regionData;
            if($scope.data["type"] == "user" && vm.categoryStatus == "regions"){
                $scope.canModify = true;
            }
            else{
                $scope.canModify = false;
            }

            //selectedMarkerIdx;
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }
    //-----------------region Process-----------------------------
        // 새로운 지역 만들기 Process
        function makeRegionDetail(answer){
            //custom event data(detail) -> event data(detail + shape&marker)
            var postData = removeOverlayAndGetData(answer);
            var respo = PostAreaUser(answer);
            respo.then(
                function successFunc(response){
                    if(response.data == "duplicatedName"){
                        alert('중복된 이름입니다. 다른 이름을 설정하세요');
                    }
                    else if(response.data == "notAllowed"){
                        alert('notAllowed');
                    }
                    else if(response.data == "success"){
                        refreshRegionData("regions");   //refresh region & goto state
                    }
                    //console.log("asdf");
                },
                 function failFunc(response){
                    console.log(response);
                });
            //반드시 status를 바꾸기 전에 overlaydata를 저장해 놓을것. 
            //PostAreaUser(newRegionObj);
            
        }
        

        //커스텀 지역 내용 수정 Process.
        function modifyRegionDetail(inData){
            //데이터 변경을 위한 statue 전환.
            var respo = PutAreaUser(inData);
            respo.then(
                function successFunc(response){
                    if(response.data == "duplicatedName"){
                        alert('중복된 이름입니다. 다른 이름을 설정하세요');
                    }
                    else if(response.data == "notAllowed"){
                        alert('notAllowed');
                    }
                    else if(response.data == "success"){
                        refreshRegionData("regions");   //refresh region & goto state
                    }
                    else if(response.data == "noLocation"){
                        alert('수정하려는 지역이 존재하지 않습니다.');
                        refreshRegionData("regions");

                    }
                    //console.log("asdf");
                },
                 function failFunc(response){
                    console.log(response);
                });
            selectedMarker = null;
            selectedMarkerIdx = 0;
        };

        function deleteRegion(inData){
            selectedMarker = null;
            selectedMarkerIdx = 0;
            var respo = DeleteAreaUser(inData);
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
                        refreshRegionData("regions");   //refresh region & goto state
                    }
                },
                 function failFunc(response){
                    console.log(response);
                });
        }

    //----------------------------커스텀 내용 생성 / 수정----------------

        //커스텀이벤트 내용 생성 / 수정 다이얼로그
        function showCreateCustomEventDialog(ev) {
            $mdDialog.show({
                controller: CreateCustomEventDialogController,
                templateUrl: 'app/main/map/dialogCreateCustomEvent.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: false, // Only for -xs, -sm breakpoints.
                resolve:{
                    modifiedData : function(){
                        if(isModifyCustomEventInfo == true)
                            //use vm.customEventData[vm.selectedCustomEventIdx]
                            return vm.customEventData[vm.selectedCustomEventIdx];
                        else
                            return null;
                    },
                    inLid : function(){
                        if(isModifyCustomEventInfo == true){
                            return vm.lidForEvent;
                        }
                        else{
                            return vm.lidForEvent
                        }
                    }
                }
            })
            .then(function(answer) {
                if(isModifyCustomEventInfo == false)
                    makeCustomEventDetail(answer);   
                else{
                    modifyCustomEventDetail(answer);
                }
            }, function() {
                isModifyCustomEventInfo = false;    // modify mode 해제
            });
        };

        //커스텀이벤트 내용 생성/ 수정 컨트롤러
        function CreateCustomEventDialogController($scope, $mdDialog, $sessionStorage, modifiedData, inLid) {
            //modify를 위한 dialog 생성.
            if(isModifyCustomEventInfo == true){
                $scope.isModify = true; //dialog에서 create/detail 상태에 따른 제목 수정
                $scope.currentUserNickname = $sessionStorage.get('nickname');
                $scope.retData = modifiedData;
                $scope.fromDateD = new Date();
                $scope.fromDateD.setTime(modifiedData["fromDate"]);
                $scope.toDateD = new Date();
                $scope.toDateD.setTime(modifiedData["toDate"]);
            }
            else{
                $scope.isModify = false;
                $scope.fromDateD = new Date();
                $scope.toDateD = new Date();
                $scope.currentUserNickname = $sessionStorage.get('nickname');
                $scope.retData = 
                {
                    "title": "",
                    "l_id" : inLid,
                    "fromDate" : "",
                    "toDate" : "",
                    "about" : "",
                    "tags" : []
                };
            }
            
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function() {
                //$scope.retData["creator"]["memberSeq"] = $sessionStorage.get('memberSeq');
                $scope.retData["fromDate"] = Date.parse($scope.fromDateD);
                $scope.retData["toDate"] = Date.parse($scope.toDateD);
                $scope.retData["l_id"] = inLid;
                $mdDialog.hide($scope.retData);
            };
            $scope.newTag = function(chip)
             {
                 return { name : chip };
             };
        }

    //-------------커스텀 내용 다이얼로그-------------------------
        //커스텀 이벤트 리스트를 보여주는 다이얼로그-----------------------
        function showCustomEventListDialog(ev) {
            $mdDialog.show({
                controller: CustomEventListDialogController,
                templateUrl: 'app/main/map/dialogCustomEventList.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: false, // Only for -xs, -sm breakpoints.
                resolve: {
                    eventDataList : function(){
                        return vm.customEventDataOrderbyRegions[String(vm.markerData["customevent"][selectedMarkerIdx]["id"])];      
                    }
                }
            })
            .then(function(answer) {
                if(answer == "addEvent"){
                    vm.lidForEvent = vm.markerData["customevent"][selectedMarkerIdx]["id"];
                    showCreateCustomEventDialog();
                }
                else{
                    //이벤트리스트 중 한 이벤트를 선택한 경우 answer값은 event의 id
                    vm.lidForEvent = vm.markerData["customevent"][selectedMarkerIdx]["id"];
                    vm.eventDataId = answer;
                    showCustomEventDialog();
                    //answer == event id (customEvent.json의 id)
                }
            }, function() {
                //alert('none..');
            });
        };

        // 커스텀이벤트리스트를 보여주는 다이얼로그 컨트롤러
        function CustomEventListDialogController($scope, $mdDialog, eventDataList) {
            $scope.datalist = eventDataList;
            //selectedMarkerIdx;
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }

        //커스텀이벤트의 내용을 보여주는 다이얼로그---------------------
        function showCustomEventDialog(ev) {
            $mdDialog.show({
                controller: CustomEventDialogController,
                templateUrl: 'app/main/map/dialogCustomEvent.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: false, // Only for -xs, -sm breakpoints.
                resolve: {
                    eventData : function(){
                        //내용 선택시 vm.customEventData에서 해당 데이터의 idx를 찾아 selectedCustomEventidx에 저장. 후에 데이터 수정/삭제에 쓰임.
                        for(var i=0 ;i<vm.customEventData.length; i++){
                            if(vm.customEventData[i]["id"] == vm.eventDataId){
                                vm.selectedCustomEventIdx = i;
                                return vm.customEventData[vm.selectedCustomEventIdx];
                            }
                        }
                        return null;
                    }
                }
            })
            .then(function(answer) {
                if(answer == "modifyShape"){
                    
                }
                //use vm.customEventData[vm.selectedCustomEventIdx]
                else if(answer == "modifyInfo"){
                    isModifyCustomEventInfo = true;
                    showCreateCustomEventDialog();
                }
                else if(answer == "delete"){
                    deleteCustomEvent(vm.customEventData[vm.selectedCustomEventIdx]);
                }
            }, function() {
                //alert('none..');
            });
        };

        // 커스텀이벤트의 내용을 보여주는 다이얼로그 컨트롤러
        function CustomEventDialogController($scope, $mdDialog, eventData) {
            $scope.data = eventData;
            $scope.toDateD = new Date();
            $scope.toDateD.setTime(eventData["toDate"]);
            $scope.fromDateD = new Date();
            $scope.fromDateD.setTime(eventData["fromDate"]);
            $scope.canModify = true;
            //selectedMarkerIdx;
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }

        
    //-----------------Process-----------------------------
        // 새로운 커스텀 이벤트 세부 내용 만들기 Process
        function makeCustomEventDetail(answer){
            var respo = PostCustomEventData(answer);
            respo.then(
                function successFunc(response){
                    if(response.data == "noMember"){
                        alert('사용자 정보 없음');
                    }
                    else if(response.data == "success"){
                        refreshCustomEventData("customevent");   //refresh region & goto state
                    }
                },
                 function failFunc(response){
                    console.log(response);
                });
        }
        
        //커스텀 이벤트 내용 수정 Process.
        function modifyCustomEventDetail(answer){

            var respo = PutCustomEventData(answer);
            respo.then(
                function successFunc(response){
                    if(response.data == "noMember"){
                        alert('사용자 정보 없음');
                    }
                    else if(response.data == "noEvent"){
                        alert('수정하려는 이벤트가 존재하지 않습니다.');
                        refreshCustomEventData("customevent");
                    }
                    else if(response.data == "success"){
                        refreshCustomEventData("customevent");   //refresh region & goto state
                    }
                },
                 function failFunc(response){
                    console.log(response);
                });

            isModifyCustomEventInfo = false;    // modify mode 해제
        }


        function deleteCustomEvent(inData){
            //inData의 id로 delete 진행.
            var respo = DeleteCustomEventData(inData);
            respo.then(
                function successFunc(response){
                    if(response.data == "noEvent"){
                        alert('수정하려는 이벤트가 존재하지 않습니다.');
                        refreshCustomEventData("customevent");
                    }
                    else if(response.data == "success"){
                        refreshCustomEventData("customevent");   //refresh region & goto state
                    }
                },
                 function failFunc(response){
                    console.log(response);
                });
        }

    //---------------좌하단 fab drawing 버튼------------------------------------
        // 클릭 시 호출되는 핸들러 입니다
        vm.selectDrawOverlay = function(type) {
            if(type == "CREATE"){
                // 현재 drawingManger에 있는 데이터 획득
                var curDrawingObj = drawingManager.getData();
                //마커하나 도형하나 있는지 체크
                var shapeType = null;
                if(curDrawingObj["circle"].length != 0){
                    shapeType = "circle";
                }
                else if(curDrawingObj["rectangle"].length != 0){
                    shapeType = "rectangle";
                }
                else if(curDrawingObj["polygon"].length != 0){
                    shapeType = "polygon";
                }

                if(curDrawingObj["marker"].length == 1 && shapeType != null){
                    if(!isMarkerInShape(curDrawingObj["marker"][0]["y"], curDrawingObj["marker"][0]["x"], curDrawingObj[shapeType][0], shapeType)){    //마커가 지역 안에 있는지 체크한다.
                        alert('marker should be in region!');
                    }
                    else{   // 모든 조건분기 통과시
                        if(vm.categoryStatus == "customevent"){
                            //커스텀 이벤트 도형을 수정중인 경우
                            if(isModifyCustomEventShape == true){
                                //updateShape();
                            }
                            else{
                                //생성 및 등록
                                //showCreateCustomEventDialog();
                            }
                        }
                        else if(vm.categoryStatus == "regions"){
                            if(isModifyRegionShape == true){
                                updateShape();
                            }
                            else{
                                //create
                                showCreateRegionDialog();
                            }
                        }
                        
                    }
                }
                else{
                    alert('need to make at least 1 marker and 1 region');
                }
            }
            else if(type == "CANCEL"){
                var tempStatusForRegionMenu = vm.categoryStatus;
                categoryStatusChangeProcess("none", true);
                categoryStatusChangeProcess(tempStatusForRegionMenu, false);
            }
            else{
                // 그리기 중이면 그리기를 취소합니다
                drawingManager.cancel();
                
                // 현재 drawingManger에 있는 데이터 획득
                var curDrawingObj = drawingManager.getData();

                // 중복 그림 제거
                var drawingManagerOverlays = drawingManager.getOverlays();
                if(type == "MARKER" && curDrawingObj["marker"].length != 0){
                    drawingManager.remove(drawingManagerOverlays["marker"][0]);
                }
                else{
                    if(type != "MARKER"){
                        if(curDrawingObj["circle"].length != 0){
                            drawingManager.remove(drawingManagerOverlays["circle"][0]);
                        }
                        else if(curDrawingObj["rectangle"].length != 0){
                            drawingManager.remove(drawingManagerOverlays["rectangle"][0]);
                        }
                        else if(curDrawingObj["polygon"].length != 0){
                            drawingManager.remove(drawingManagerOverlays["polygon"][0]);
                        }
                    }
                }

                // 클릭한 그리기 요소 타입을 선택합니다
                drawingManager.select(daum.maps.Drawing.OverlayType[type]);
            }
            
        }

         //drawing 툴팁 띄우기 지연
        $scope.$watch(function() { return vm.customEventIsOpen}, function(newVal) {
            if (newVal) {
                $timeout(function() {
                    vm.customEvnetTooltipVisible = vm.customEventIsOpen;     //delay open
                }, 600);
            } else {
                    vm.customEvnetTooltipVisible = vm.customEventIsOpen;     //delay 없이 바로 close
            }
        }, true);

        //drawing 툴팁 고정
        $scope.$watch(function() { return vm.customEvnetTooltipVisible}, function(newVal) {
            if(vm.customEventIsOpen){
                vm.customEvnetTooltipVisible = vm.customEventIsOpen;
            }
        }, true);


    //--------------------------카테고리를 위한 커스텀마커 만들기 -------------------------------

        var isModifyCustomCategoryMarker = false;

        vm.customCategoryMenu = [
            {"name":"NEW", "type":"MARKER", "icon" : "icon-map-marker"},  
            {"name":"생성", "type":"CREATE", "icon" : "icon-play-box-outline"},
            {"name":"취소", "type":"CANCEL", "icon" : "icon-cancel"}
        ];
        //카테고리 메뉴 선택 = inputType : CREATE, MARKER
        vm.selectCustomCategoryMenu = function(inputType){
            if(inputType == "MARKER"){
                // 그리기 중이면 그리기를 취소합니다
                drawingManager.cancel();
                
                // 현재 drawingManger에 있는 데이터 획득
                var curDrawingObj = drawingManager.getData();

                // 중복 그림 제거
                var drawingManagerOverlays = drawingManager.getOverlays();
                if(inputType == "MARKER" && curDrawingObj["marker"].length != 0){
                    drawingManager.remove(drawingManagerOverlays["marker"][0]);
                }
                // 클릭한 그리기 요소 타입을 선택합니다
                drawingManager.select(daum.maps.Drawing.OverlayType[inputType]);
            }
            else if(inputType == "CREATE"){
                var curDrawingObj = drawingManager.getData();
                //마커하나 있는지 체크
                if(curDrawingObj["marker"].length == 1){
                    //커스텀 이벤트 도형을 수정중인 경우
                    if(isModifyCustomCategoryMarker == true){
                        //위치 수정
                        //console.log("call modifyCustomMarker in vm.selectCustomCategoryMenu");
                        modifyCustomMarker(vm.markerData[vm.categoryStatus][selectedMarkerIdx]);
                    }
                    else{
                        //생성 및 등록
                        showCreateCustomMarkerDialog();
                    }
                }
                else{
                    alert('need to make at least 1 marker');
                }
            }
            else if(inputType == "CANCEL"){
                var tempStatusForCustomCategoryMenu = vm.categoryStatus;
                categoryStatusChangeProcess("none", true);
                categoryStatusChangeProcess(tempStatusForCustomCategoryMenu, false);
            }
        };




        var isModifyCustomCategoryMarkerDetail = false;
//------------------------------------------
        function showCreateCustomMarkerDialog(ev) {
            $mdDialog.show({
                controller: showCreateCustomMarkerDialogController,
                templateUrl: 'app/main/map/dialogCreateCustomMarker.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: false, // Only for -xs, -sm breakpoints.
            })
            .then(function(answer) {
                if(isModifyCustomCategoryMarkerDetail == false){
                    disableAllMarkerListener();
                    createCustomMarker(answer);
                }
                else{
                    disableAllMarkerListener();
                    modifyCustomMarker(answer);
                }
                
            }, function() {
                //alert('none..');
            });
        };

        // 커스텀마커 내용을 보여주는 다이얼로그 컨트롤러
        function showCreateCustomMarkerDialogController($scope, $mdDialog) {
            if (isModifyCustomCategoryMarkerDetail != true){
                $scope.data = {};
                $scope.data["name"] = "";
                $scope.data["center"] = {"lat" : 0.0, "lng" : 0.0};
                $scope.data["markerCategory"] = {"name" : vm.categoryStatus};
                $scope.data["type"] = "user";
                $scope.status = vm.categoryStatus;
                $scope.isModify = false;
            }
            else{
                $scope.data = vm.markerData[vm.categoryStatus][selectedMarkerIdx];
                $scope.status = vm.categoryStatus;
                $scope.isModify = true;

            }
            if($scope.data["type"] == "user"){
                $scope.canModify = true;
            }
            else{
                $scope.canModify = false;
            }
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                //console.log($scope.data);
                
                $mdDialog.hide($scope.data);
            };
        }

       
        //지금까지 생성한 마커를 post합니다.
        function createCustomMarker(inData){
            disableAllMarkerListener();
            var ret = removeOverlayAndGetData(inData);
            //console.log("ret create custom marker");
            //console.log(ret);
            var respo = PostCustomMarkerData(ret);
            respo.then(
                function successFunc(response){
                    if(response.data == "noCategory"){
                        alert('해당 카테고리가 존재하지 않습니다.');
                        categoryStatusChangeProcess("none", true);
                    }
                    else if(response.data == "duplicatedName"){
                        alert('중복된 이름입니다. 다른 이름으로 시도하세요.');
                    }
                    else if(response.data == "notAllowed"){
                        alert('허용되지 않은 요청');
                        refreshCustomMarkerData(inData["markerCategory"]["name"], false);
                    }
                    else if(response.data == "success"){
                        refreshCustomMarkerData(inData["markerCategory"]["name"], false);   //refresh region & goto state
                    }
                    enableAllMarkerListener();
                },
                 function failFunc(response){
                    console.log(response);
                    enableAllMarkerListener();
                });
        }

        //수정된 정보를 put 합니다.
        function modifyCustomMarker(inData){
            var ret;
            disableAllMarkerListener()
            // 위치만 바뀜.
            if(isModifyCustomCategoryMarker == true){
                isModifyCustomCategoryMarker = false;
                ret = removeOverlayAndGetData(inData);
            }
            else if(isModifyCustomCategoryMarkerDetail == true){   //내용만 바뀜.
                isModifyCustomCategoryMarkerDetail = false;
                ret = inData;
                console.log("내용만 바뀜");
                console.log(inData);
            }
            var respo = PutCustomMarkerData(inData);
            respo.then(
                function successFunc(response){
                    if(response.data == "noCategory"){
                        alert('해당 카테고리가 존재하지 않습니다.');
                        categoryStatusChangeProcess("none", true);
                    }
                    else if(response.data == "duplicatedName"){
                        alert('중복된 이름입니다. 다른 이름으로 시도하세요.');
                    }
                    else if(response.data == "notAllowed"){
                        alert('허용되지 않은 요청');
                        refreshCustomMarkerData(inData["markerCategory"]["name"], false);
                    }
                    else if(response.data == "success"){
                        //categoryStatusChangeProcess("none", true);
                        refreshCustomMarkerData(inData["markerCategory"]["name"], false);   //refresh region & goto state
                    }
                    else if(response.data == "noMarker"){
                        alert('수정하고자 하는 마커가 없습니다.');
                        refreshCustomMarkerData(inData["markerCategory"]["name"], false);
                    }
                    enableAllMarkerListener();
                },
                 function failFunc(response){
                    console.log(response);
                    enableAllMarkerListener();
                });
        }

        function deleteCustomMarker(inData){
            disableAllMarkerListener();
            var respo = DeleteCustomMarkerData(inData);
            respo.then(
                function successFunc(response){
                    if(response.data == "success"){
                        //categoryStatusChangeProcess("none", true);
                        refreshCustomMarkerData(inData["markerCategory"]["name"], false);   //refresh region & goto state
                    }
                    else if(response.data == "noMarker"){
                        alert('수정하고자 하는 마커가 없습니다.');
                        refreshCustomMarkerData(inData["markerCategory"]["name"], false);
                    }
                },
                 function failFunc(response){
                    console.log(response);
                });
            enableAllMarkerListener();

        }


        function showMarkerDialog(ev) {
            $mdDialog.show({
                controller: MarkerDialogController,
                templateUrl: 'app/main/map/markerDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: false // Only for -xs, -sm breakpoints.
            })
            .then(function(answer) {
                if(answer == "modifyShape"){
                    disableAllMarkerListener();
                    isModifyCustomCategoryMarker = true;
                    modifyShape(vm.markerData[vm.categoryStatus][selectedMarkerIdx]);
                }
                else if(answer == "modifyInfo"){
                    disableAllMarkerListener();
                    isModifyCustomCategoryMarkerDetail = true;
                    showCreateCustomMarkerDialog();
                }
                else if(answer == "delete"){
                    disableAllMarkerListener();
                    deleteCustomMarker(vm.markerData[vm.categoryStatus][selectedMarkerIdx]);
                }
            }, function() {
                //alert('none..');
            });
        };

        function MarkerDialogController($scope, $mdDialog) {
            //$scope.data = selectedMarker.getTitle();
            $scope.data = vm.markerData[vm.categoryStatus][selectedMarkerIdx];
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }



    //--------------------------------------드로잉 관련 기타 함수------------------------------
        //지도상에 그려져 있는 overlay(마커하나, 도형하나)를 제거하면서 inObjData에 정보 갱신 & return
        function removeOverlayAndGetData(inObjData){
            var curDrawingObj = drawingManager.getData();
            var newCustomEventObj = inObjData;
            newCustomEventObj["center"]["lat"] = curDrawingObj["marker"][0]["y"];
            newCustomEventObj["center"]["lng"] = curDrawingObj["marker"][0]["x"];

            //도형별 데이터를 생성하면서 그려진 overlay 제거한다.
            var drawingManagerOverlays = drawingManager.getOverlays();
            drawingManager.remove(drawingManagerOverlays["marker"][0]);

            if(curDrawingObj["circle"].length != 0){
                newCustomEventObj["shape"] = "CIRCLE";
                newCustomEventObj["center"]["lat"] = curDrawingObj["circle"][0]["center"]["y"];
                newCustomEventObj["center"]["lng"] = curDrawingObj["circle"][0]["center"]["x"];
                newCustomEventObj["center"]["radius"] = curDrawingObj["circle"][0]["radius"];
                drawingManager.remove(drawingManagerOverlays["circle"][0]);
            }
            else if(curDrawingObj["rectangle"].length != 0){
                newCustomEventObj["path"] = [];
                newCustomEventObj["shape"] = "RECTANGLE";
                newCustomEventObj["path"][0] = {"lat" : curDrawingObj["rectangle"][0]["sPoint"]["y"], "lng" : curDrawingObj["rectangle"][0]["sPoint"]["x"]};
                newCustomEventObj["path"][1] = {"lat" : curDrawingObj["rectangle"][0]["ePoint"]["y"], "lng" : curDrawingObj["rectangle"][0]["ePoint"]["x"]};
                drawingManager.remove(drawingManagerOverlays["rectangle"][0]);
            }
            else if(curDrawingObj["polygon"].length != 0){
                newCustomEventObj["shape"] = "POLYGON";
                newCustomEventObj["path"] = [];
                for(var i = 0; i< curDrawingObj["polygon"][0]["points"].length; i++){
                    newCustomEventObj["path"][i] = {"lat" : curDrawingObj["polygon"][0]["points"][i]["y"], "lng" : curDrawingObj["polygon"][0]["points"][i]["x"]};
                }
                drawingManager.remove(drawingManagerOverlays["polygon"][0]);
            }

            return newCustomEventObj;
        }

        //data에 해당하는 마커/도형을 drawing manager에게 전달하여 사용자가 수정 가능하도록 한다.
        function addDataToDrawingManager(data){
            //전달 이전에 미리 그려놓은 그림 삭제
            //DrawingManager가 존재하는 경우 그림그리는 도중일 수 있으므로 남은 그림을 제거한다.
            if(drawingManager != null){
                var drawingManagerOverlays = drawingManager.getOverlays();
                if(drawingManagerOverlays["marker"].length != 0){
                    drawingManager.remove(drawingManagerOverlays["marker"][0]);
                }
                if(drawingManagerOverlays["circle"].length != 0){
                    drawingManager.remove(drawingManagerOverlays["circle"][0]);
                }
                else if(drawingManagerOverlays["rectangle"].length != 0){
                    drawingManager.remove(drawingManagerOverlays["rectangle"][0]);
                }
                else if(drawingManagerOverlays["polygon"].length != 0){
                    drawingManager.remove(drawingManagerOverlays["polygon"][0]);
                }
            }
            //add marker
            drawingManager.put(daum.maps.drawing.OverlayType.MARKER, new daum.maps.LatLng(data["center"]["lat"], data["center"]["lng"]), 1);
            //add shape
            //shape key가 있는 경우에만 도형 전달
            if("shape" in data){
                if(data["shape"] == "CIRCLE"){
                    drawingManager.put(daum.maps.drawing.OverlayType.CIRCLE, new daum.maps.LatLng(data["center"]["lat"], data["center"]["lng"]), data["center"]["radius"]);
                }
                else if(data["shape"] == "POLYGON"){
                    var inPath = [];
                    for(var i=0; i<data["path"].length; i++){
                        inPath[i] = new daum.maps.LatLng(data["path"][i]["lat"], data["path"][i]["lng"]);
                    }
                    drawingManager.put(daum.maps.drawing.OverlayType.POLYGON, inPath);
                }
                else if(data["shape"] == "RECTANGLE"){
                    var bounds = new daum.maps.LatLngBounds(
                        new daum.maps.LatLng(data["path"][0]["lat"], data["path"][0]["lng"]),
                        new daum.maps.LatLng(data["path"][1]["lat"], data["path"][1]["lng"])
                        );
                    drawingManager.put(daum.maps.drawing.OverlayType.RECTANGLE, bounds);
                }
            }

        }


        function disableAllMarkerListener(){
            for(var i = 0; i< printedCategoryMarkers.length; i++){
                printedCategoryMarkers[i].setClickable(false);
            }
            for(var i=0; i< peerOnMapTransparnetMarkers.length; i++){
                peerOnMapTransparnetMarkers[i].setClickable(false);
            }
            disableAllListener = true;
        };
        function enableAllMarkerListener(){
            for(var i = 0; i< printedCategoryMarkers.length; i++){
                printedCategoryMarkers[i].setClickable(true);
            }
            for(var i=0; i< peerOnMapTransparnetMarkers.length; i++){
                peerOnMapTransparnetMarkers[i].setClickable(true);
            }
            disableAllListener = false; //polygon listener를 위함
        };
        function findIdWithName(inName){
            for(var i =0; i<vm.markerData["regions"].length; i++){
                if(vm.markerData["regions"][i]["name"] == inName)
                    return i;
            }
            return -1;
        }

        function findNameWithId(id){
            if(id < 0 || id > vm.markerData["regions"].length - 1)
                return null;
            return vm.markerData["regions"][id]["name"];
        }

    //----------------------------------카테고리 선택 메뉴 --------------------------
        
        vm.catCount = 0;
        vm.limitNum = 4;
        var currentCategoryIdx = 0;
        vm.nextCat = false;
        vm.currentCategoryData = [];         //인쇄할 4개 이하의 카테고리 array
        var currentWholeCategoryData = [];   //해당 카테고리의 전체 array
        function get4CategoryObj(curIdx, objc){
            var ret = [];
            //console.log("oblen : " + objc.length);
            var fixedCurIdx = curIdx;
            for(var i = 0; i<objc.length-fixedCurIdx && i<4; i++, curIdx++){
                ret[i] = objc[curIdx];
                //console.log("...");
            }
            if(objc.length > curIdx){
                vm.nextCat = true;
            }
            else{
                vm.nextCat = false;
            }
            vm.limitNum = i;
            //console.log("lmitm : " + vm.limitNum);
            return ret;
        }

        initCategorySelect();
        function initCategorySelect(){
            //configNextCat();
            currentCategoryIdx = 0;
            currentWholeCategoryData = vm.categoryMenu; //초기 데이터
            //console.log(vm.categoryMenu);
            vm.currentCategoryData = get4CategoryObj(currentCategoryIdx, currentWholeCategoryData);
            vm.limitNum = 4;
            vm.catCount = 0;
            //console.log(vm.currentCategoryData);
        }
        function configNextCat(){
            if(vm.currentCategoryData.length > 4){
                vm.nextCat = true;
            }
        }
        //
        vm.categorySelect = function(answer){
            //console.log(answer);
            if(answer == "NEXT"){
                currentCategoryIdx += 4;
                vm.currentCategoryData = get4CategoryObj(currentCategoryIdx, currentWholeCategoryData);
                //configNextCat();
                $timeout(function () {
                        vm.categoryIsOpen = true;
                    }, 600);
            }
            else{
                for(var i=0; i<vm.currentCategoryData.length; i++){
                    if(vm.currentCategoryData[i]["type"] == answer){
                        vm.currentCategoryData = vm.currentCategoryData[i];
                    }
                }
                //더 이상 inner 카테고리가 없는 경우
                if(!("inner" in vm.currentCategoryData)){
                    //vm.categoryStatus = answer;
                    if(vm.currentCategoryData["type"] == "none"){
                        //없는 카테고리이므로 되돌아간다.
                        categoryStatusChangeProcess("none", false);
                        initCategorySelect();
                        //currentCategoryIdx = 0;
                        //vm.catCount = 1;
                    }
                    else{
                        categoryStatusChangeProcess(vm.currentCategoryData["type"], false);
                        initCategorySelect();
                        //currentCategoryIdx = 0;
                        //vm.catCount = 1;
                    }
                    
                }
                else{
                    currentWholeCategoryData = vm.currentCategoryData["inner"];
                    currentCategoryIdx = 0;
                    vm.currentCategoryData = get4CategoryObj(currentCategoryIdx, currentWholeCategoryData);
                    //카테고리 재 오픈
                    $timeout(function () {
                        vm.categoryIsOpen = true;
                    }, 600);
                }
                
            }
           
        }
        
        vm.categoryIsOpen = false;  //카테고리 버튼의 open 여부 bind
        vm.tooltipVisible = false;  //카테고리 툴팁의 visible 여부 bind
       
        //카테고리 버튼 클릭 함수.
        vm.categoryFabClicked = function(){
           
        }
        //var curChgCategorStatus = "none";
        //카테고리 툴팁 띄우기 지연
        $scope.$watch(function() { return vm.categoryIsOpen}, function(newVal) {
            if (newVal) {
                if(vm.catCount == 1){
                        categoryStatusChangeProcess("none", false);
                    }
                $timeout(function() {
                    vm.tooltipVisible = vm.categoryIsOpen;     //delay open
                }, 600);
            } else {
                    vm.tooltipVisible = vm.categoryIsOpen;     //delay 없이 바로 close
            }
        }, true);

        //카테고리 툴팁 고정
        $scope.$watch(function() { return vm.tooltipVisible}, function(newVal) {
            if(vm.categoryIsOpen){
                vm.tooltipVisible = vm.categoryIsOpen;
            }
        }, true);

    //-------------------------마커 이미지 로드------------------------------------
       
        
        var categoryMarkers = {};   
        var selectedMarker = null; // 클릭한 마커를 담을 변수
        var selectedMarkerIdx = 0;
        var normalImage = {};   //Image[categoryIndex]
        var overImage = {};
        var clickImage = {};

        var MARKER_WIDTH = 33, // 기본, 클릭 마커의 너비
            MARKER_HEIGHT = 36, // 기본, 클릭 마커의 높이
            OFFSET_X = 12, // 기본, 클릭 마커의 기준 X좌표
            OFFSET_Y = MARKER_HEIGHT, // 기본, 클릭 마커의 기준 Y좌표
            OVER_MARKER_WIDTH = 40, // 오버 마커의 너비
            OVER_MARKER_HEIGHT = 42, // 오버 마커의 높이
            OVER_OFFSET_X = 13, // 오버 마커의 기준 X좌표
            OVER_OFFSET_Y = OVER_MARKER_HEIGHT, // 오버 마커의 기준 Y좌표
            //SPRITE_MARKER_URL = 'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markers_sprites2.png', // 스프라이트 마커 이미지 URL
            //SPRITE_MARKER_URL = 'http://imageshack.com/a/img922/8380/GgDPqi.png', // 스프라이트 마커 임시 이미지 URL
            SPRITE_MARKER_URL = 'assets/images/marker/marker_sprites_transparent0.png', // 스프라이트 마커 임시 이미지 URL
            SPRITE_WIDTH = 125, // 스프라이트 이미지 너비
            SPRITE_HEIGHT = 307, // 스프라이트 이미지 높이. 이미지 변경시 너비와 높이 변경 필수.
            SPRITE_GAP = 10; // 스프라이트 이미지에서 마커간 간격

        var markerSize = new daum.maps.Size(MARKER_WIDTH, MARKER_HEIGHT), // 기본, 클릭 마커의 크기
            markerOffset = new daum.maps.Point(OFFSET_X, OFFSET_Y), // 기본, 클릭 마커의 기준좌표
            overMarkerSize = new daum.maps.Size(OVER_MARKER_WIDTH, OVER_MARKER_HEIGHT), // 오버 마커의 크기
            overMarkerOffset = new daum.maps.Point(OVER_OFFSET_X, OVER_OFFSET_Y), // 오버 마커의 기준 좌표
            spriteImageSize = new daum.maps.Size(SPRITE_WIDTH, SPRITE_HEIGHT); // 스프라이트 이미지의 크기

        // 마커 이미지를 생성합니다.
        for (var i = 0, k=0; k < categoryTypes.length; i++, k++) {
            //every 6 marker, change marker url.
            if(k % 6 == 0){
                SPRITE_MARKER_URL = 'assets/images/marker/marker_sprites_transparent'+ (k/6) + '.png';
                i = 0 ;
            }
            var gapX = (MARKER_WIDTH + SPRITE_GAP), // 스프라이트 이미지에서 마커로 사용할 이미지 X좌표 간격 값
                originY = (MARKER_HEIGHT + SPRITE_GAP) * i, // 스프라이트 이미지에서 기본, 클릭 마커로 사용할 Y좌표 값
                overOriginY = (OVER_MARKER_HEIGHT + SPRITE_GAP) * i, // 스프라이트 이미지에서 오버 마커로 사용할 Y좌표 값
                normalOrigin = new daum.maps.Point(0, originY), // 스프라이트 이미지에서 기본 마커로 사용할 영역의 좌상단 좌표
                clickOrigin = new daum.maps.Point(gapX, originY), // 스프라이트 이미지에서 마우스오버 마커로 사용할 영역의 좌상단 좌표
                overOrigin = new daum.maps.Point(gapX * 2, overOriginY); // 스프라이트 이미지에서 클릭 마커로 사용할 영역의 좌상단 좌표
                // 마커를 생성하고 지도위에 표시합니다
                addMarkerImage(k, normalOrigin, overOrigin, clickOrigin);
        }

        // 마커를 생성하고 지도 위에 표시하고, imageIndex 만큼의 마커에 mouseover, mouseout, click 이벤트를 등록하는 함수입니다
        function addMarkerImage(imageIndex, normalOrigin, overOrigin, clickOrigin) {
            // 기본 마커이미지, 오버 마커이미지, 클릭 마커이미지를 생성합니다
            var imageType = categoryTypes[imageIndex];
            normalImage[imageType] = createMarkerImage(markerSize, markerOffset, normalOrigin);
            overImage[imageType] = createMarkerImage(overMarkerSize, overMarkerOffset, overOrigin);
            clickImage[imageType] = createMarkerImage(markerSize, markerOffset, clickOrigin);
        };

        // MakrerImage 객체를 생성하여 반환하는 함수입니다
        function createMarkerImage(markerSize, offset, spriteOrigin) {
            return new daum.maps.MarkerImage(
            SPRITE_MARKER_URL, // 스프라이트 마커 이미지 URL
            markerSize, // 마커의 크기
            {
                offset: offset, // 마커 이미지에서의 기준 좌표
                spriteOrigin: spriteOrigin, // 스트라이프 이미지 중 사용할 영역의 좌상단 좌표
                spriteSize: spriteImageSize // 스프라이트 이미지의 크기
            }
            );
        };

    //-------------status/data 갱신에 따른 카테고리 마커 생성 및 출력-----------------------
        /*
        카테고리 등록하는법.
        1. categoryMarker.json 파일에 카테고리를 수정하거나 등록합니다. level의 마지막인 경우 inner key를 쓰지 않음.
            name은 카테고리 툴팁설명 내용, type는 카테고리 종류 구분을 위한 변수.
        2. sprites 이미지에 해당하는 마커 이미지 추가합니다.
        3. categoryTypes.json에 추가하고자 하는 category 타입 그대로 추가.
        4. map.module.js http 추가
            ** categoryTypes[]와 sprites 이미지 순서가 같아야한다. 그 외의 모든 데이터는 순서와 관련 없다.
        */

        var printedCategoryMarkers = [];    //현재 출력되는 모든 타케고리 마커 모음.
        
        // 마커 클러스터러를 생성합니다 
        var clusterer = new daum.maps.MarkerClusterer({
            map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
            averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
            minLevel: 3 // 클러스터 할 최소 지도 레벨 
        });

        //categoryStatus를 바꿀 때 반드시 이 함수를 통해 교체. Watch는 sync 문제로 인해 제거.
        //isNowDrawing : 현재 도형을 추가/변경/삭제를 위해 status를 off->on하는 경우 "none" 상태에서 region을 인쇄하는경우 
        //해당 region의 dangling problem 발생.
        function categoryStatusChangeProcess(status, isNowDrawing){
            enableAllMarkerListener();
            isModifyCustomEventShape = false;
            isModifyRegionShape = false;
            isModifyCustomCategoryMarker = false;

            isModifyCustomCategoryMarkerDetail = false;
            //modifyCustomMarker = false;
            isModifyCustomEventInfo = false;
            isModifyRegionInfo = false;

            // 바꾸기 이전의 상태가 none인 경우 기본 도형 제거

            //if(vm.categoryStatus == "none"){
            for(var i=0; i<regionShapes.length; i++){
                regionShapes[i].setMap(null);
            }
            //}

            vm.categoryStatus = status;
            //선택된 marker의 clicked image상태를 normal image로 되돌려놓는다.
            if(selectedMarker != null){
                selectedMarker.setImage(selectedMarker.normalImage);
                selectedMarker = null;
            }   
            //delete all marker on map. Init printedCategoryMarkers
            for(var i=0; i<printedCategoryMarkers.length; i++){
                printedCategoryMarkers[i].setMap(null);
                clusterer.removeMarker(printedCategoryMarkers[i]);
            }
            printedCategoryMarkers = [];
            for(var i=0; i<customEventShapes.length; i++){
                customEventShapes[i].setMap(null);
            }
            for(var i=0; i<regionShapes.length; i++){
                regionShapes[i].setMap(null);
            }


            //DrawingManager가 존재하는 경우 그림그리는 도중일 수 있으므로 남은 그림을 제거한다.
            if(drawingManager != null){
                var drawingManagerOverlays = drawingManager.getOverlays();
                if(drawingManagerOverlays["marker"].length != 0){
                    drawingManager.remove(drawingManagerOverlays["marker"][0]);
                }
                if(drawingManagerOverlays["circle"].length != 0){
                    drawingManager.remove(drawingManagerOverlays["circle"][0]);
                }
                else if(drawingManagerOverlays["rectangle"].length != 0){
                    drawingManager.remove(drawingManagerOverlays["rectangle"][0]);
                }
                else if(drawingManagerOverlays["polygon"].length != 0){
                    drawingManager.remove(drawingManagerOverlays["polygon"][0]);
                }
            }
            //카테고리가 정해져있으면 printedCategoryMarkers에 해당 카테고리 마커들을 저장하고 출력한다.
            if(vm.categoryStatus != "none"){
                for(var i=0; i<categoryMarkers[vm.categoryStatus].length; i++){
                    categoryMarkers[vm.categoryStatus][i].setMap(map);
                    printedCategoryMarkers[i] = categoryMarkers[vm.categoryStatus][i];
                    clusterer.addMarker(printedCategoryMarkers[i]);
                }
                //customevent의경우 추가적으로 도형 생성
                if(vm.categoryStatus == "customevent"){
                    for(var i=0; i<customEventShapes.length; i++){
                        customEventShapes[i].setMap(map);
                    }
                }
                //TODO regions의 경우 추가적으로 도형 생성
                if(vm.categoryStatus == "regions"){
                    for(var i=0; i<regionShapes.length; i++){
                        regionShapes[i].setMap(map);
                    }        
                }
            }
            else{   //region이 none인 경우 투명 regions 생성.
                if(isNowDrawing != true){
                    for(var i=0; i<regionShapes.length; i++){
                    regionShapes[i].setMap(map);
                    }  
                }
                 
            }
        };
        
        //JSON으로 받아온 데이터에 해당하는 모든 마커 및 도형을 생성합니다. (클라이언트 내)데이터가 갱신되는 경우 이 함수를 호출합니다.
        function createCategoryMarkersInJson(){
            customEventShapes = []; //init customEventShapes
            regionShapes = [];
            //marker.json 정보에서 categoryMarkers obj 생성.
            //console.log(markerDataSkeleton);
            vm.markerData = markerDataSkeleton;
            
            //vm.markerData = createMarkerData(MarkerData.data, markerDataSkeleton);
            //vm.markerData <- regions, customEvent
            vm.markerData["customevent"] = [];      //각 커스텀 event에 해당하는 region shape
            vm.markerData["regions"] = [];          //각 region에 해당하는 region shape
            vm.customEventDataOrderbyRegions = {};

            var regionsSetWithEvent = {};
            var markerDataCustomeventLen = 0;
            // 이벤트를 가지고 있는 regions의 집합
            for(var i = 0; i < vm.customEventData.length; i++){
                var strLid = String(vm.customEventData[i]["l_id"]);
                var intLid = vm.customEventData[i]["l_id"];
                if( regionsSetWithEvent[strLid] ){
                    //only add to vm.customEventDataOrderbyRegions
                    var leng = vm.customEventDataOrderbyRegions[strLid].length;
                    vm.customEventDataOrderbyRegions[strLid][leng] = vm.customEventData[i];  //index of vm.customEventData
                    regionsSetWithEvent[strLid] = true;
                    //markerData에 해당 region의 정보 등록
                    //subAreaData에서 l_id를 가진 정보 찾기
                    var targetIdx = -1;
                    for(var k=0; k<subAreaData.length; k++){
                        if(subAreaData[k]["id"] == intLid){
                            targetIdx = k;
                        }
                    }

                    if(targetIdx != -1){
                        vm.markerData["customevent"][markerDataCustomeventLen] = subAreaData[targetIdx];
                        markerDataCustomeventLen++;
                    }
                    else{
                        //console.log("같은 지역에 여러 이벤트 생성중");
                    }
                    
                }
                else{
                    //new add
                    vm.customEventDataOrderbyRegions[strLid] = [];

                    var leng = vm.customEventDataOrderbyRegions[strLid].length;
                    vm.customEventDataOrderbyRegions[strLid][leng] = vm.customEventData[i];  //index of vm.customEventData
                    regionsSetWithEvent[strLid] = true;

                    //markerData에 해당 region의 정보 등록
                    //subAreaData에서 l_id를 가진 정보 찾기
                    var targetIdx = -1;
                    for(var k=0; k<subAreaData.length; k++){
                        if(subAreaData[k]["id"] == intLid){
                            targetIdx = k;
                        }
                    }

                    if(targetIdx != -1){
                        vm.markerData["customevent"][markerDataCustomeventLen] = subAreaData[targetIdx];
                        markerDataCustomeventLen++;
                    }
                    else{
                        //console.log("같은 지역에 여러 이벤트 생성중");
                    }
                }         
            }

            for(var i=0; i< subAreaData.length; i++){
                vm.markerData["regions"][i] = subAreaData[i];
            }

            var loop = 0;
            for(; loop<categoryTypes.length; loop++){
                //set empty array in categoryMarkers{"categoryType" : [], "categoryType2" : [] ...}
                categoryMarkers[categoryTypes[loop]] = [];   
                //카테고리 타입별 위치정보 개수 만큼 loop
                for(var idx = 0; idx< vm.markerData[categoryTypes[loop]].length; idx++){
                    createCategoryMarkers(loop, idx);
                    if(categoryTypes[loop] == "customevent"){
                        customEventShapes[idx] = createShapes(vm.markerData["customevent"], idx, "customevent");
                    }
                    else if(categoryTypes[loop] == "regions"){                    
                        regionShapes[idx] = createShapes(vm.markerData["regions"], idx, "regions", loop);
                    }
                }
            }


            
        };

        // 타입, idx에 해당한는 마커를 1개 생성하고 이미지는 해당 카테고리의 마커 이미지를 사용합니다.(이미지, click 리스커 등등)
        function createCategoryMarkers(typeI, typeIdx) {
            var marker = new daum.maps.Marker({
                position: new daum.maps.LatLng(vm.markerData[categoryTypes[typeI]][typeIdx]["center"]["lat"], vm.markerData[categoryTypes[typeI]][typeIdx]["center"]["lng"]),
                image: normalImage[categoryTypes[typeI]],
                title: vm.markerData[categoryTypes[typeI]][typeIdx]["name"]   //set marker title. If mouse cursor is on the marker, can see title.
            });

            // 마커 객체에 마커아이디와 마커의 기본 이미지를 추가합니다
            marker.normalImage = normalImage[categoryTypes[typeI]];

            // 마커에 mouseover 이벤트를 등록합니다
            daum.maps.event.addListener(marker, 'mouseover', function () {

            // 클릭된 마커가 없거나 mouseover된 마커가 클릭된 마커가 아니면
            // 마커의 이미지를 오버 이미지로 변경합니다
                if (!selectedMarker || selectedMarker !== marker) {
                    marker.setImage(overImage[categoryTypes[typeI]]);
                }
                // 현재 상태가 커스텀 이벤트 상태인 경우 폴리곤의 색을 진하게 만든다. 
                if (vm.categoryStatus == "customevent"){
                    customEventShapes[typeIdx].setOptions({
                        strokeWeight: 2,
                        strokeColor: '#ee7300',
                        strokeOpacity: 0.8,
                        strokeStyle: 'dashed',
                        fillColor: '#eea600',
                        fillOpacity: 0.8
                    });
                }
                if (vm.categoryStatus == "regions"){
                    regionShapes[typeIdx].setOptions({
                        strokeWeight: 1,
                        strokeColor: '#ee7300',
                        strokeOpacity: 0.2,
                        strokeStyle: 'dashed',
                        fillColor: '#66ccff',
                        fillOpacity: 0.2
                    });
                }
            });

            // 마커에 mouseout 이벤트를 등록합니다
            daum.maps.event.addListener(marker, 'mouseout', function () {
                // 클릭된 마커가 없거나 mouseout된 마커가 클릭된 마커가 아니면
                // 마커의 이미지를 기본 이미지로 변경합니다
                if (!selectedMarker || selectedMarker !== marker) {
                    //marker.setImage(normalImage[categoryTypes[i]]);
                    marker.setImage(normalImage[categoryTypes[typeI]]);
                }
                // 현재 상태가 커스텀 이벤트 상태인 경우 폴리곤의 색을 돌려놓는다. 
                if (vm.categoryStatus == "customevent"){
                    //customEventShapes[typeIdx].setMap(null);
                    customEventShapes[typeIdx].setOptions({
                        strokeWeight: 1,
                        strokeColor: '#004c80',
                        strokeOpacity: 0.8,
                        strokeStyle: 'solid',
                        fillColor: '#00EEEE',
                        fillOpacity: 0.3
                    });

                    //customEventShapes[typeIdx].setMap(map);
                }
                if (vm.categoryStatus == "regions"){
                    //customEventShapes[typeIdx].setMap(null);
                    regionShapes[typeIdx].setOptions({
                        strokeWeight: 0,
                        strokeColor: '#004c80',
                        strokeOpacity: 0.8,
                        strokeStyle: 'solid',
                        fillColor: '#ffffff',
                        fillOpacity: 0.2
                    });
                    //customEventShapes[typeIdx].setMap(map);
                }
            });

            // 마커에 click 이벤트를 등록합니다
            daum.maps.event.addListener(marker, 'click', function () {

                // 클릭된 마커가 없거나 click 마커가 클릭된 마커가 아니면
                // 마커의 이미지를 클릭 이미지로 변경합니다
                if (!selectedMarker || selectedMarker !== marker) {

                // 클릭된 마커 객체가 null이 아니면
                // 클릭된 마커의 이미지를 마커에 등록해놓았던 기본 이미지로 변경하고
                !!selectedMarker && selectedMarker.setImage(selectedMarker.normalImage);

                // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경합니다
                marker.setImage(clickImage[categoryTypes[typeI]]);
                }

                // 클릭된 마커를 현재 클릭된 마커 객체로 설정합니다
                selectedMarker = marker;
                selectedMarkerIdx = typeIdx;
                //dialog 띄우기
                if(vm.categoryStatus == "customevent"){
                    showCustomEventListDialog();
                }
                else if(vm.categoryStatus == "regions"){
                    selectedArea = vm.markerData["regions"][typeIdx];
                    vm.clickName = vm.markerData["regions"][typeIdx]["name"];
                    vm.clickUrl =  '../xwiki/bin/view/XWiki/' + vm.clickName;
                    vm.tags = vm.markerData["regions"][typeIdx]["tags"];
                    //selectedArea = subArea[typeIdx];          //subArea 정의 이전
                    //vm.clickName = subArea[typeIdx]["name"];
                    vm.openMapDialog();
                }
                else{
                    showMarkerDialog();
                }
            });

            //생성한 마커를 categoryMarkers에 저장.
            categoryMarkers[categoryTypes[typeI]][typeIdx] = marker;
        };

        //도형을 생성합니다.
        function createShapes(data, idx, categoryType, idxOfCategory){
            var shapeData = data[idx];
            var ret;
            if(categoryType == "regions"){
                var newColor = '#ffffff';//'#transparent';
                var newstrokeWeight = 0;
            }
            else if(categoryType == "customevent"){
                var newColor = '#00EEEE';
                var newstrokeWeight = 1;
            }

            if(shapeData["shape"] == "CIRCLE"){
                ret = new daum.maps.Circle({
                    center : new daum.maps.LatLng(shapeData["center"]["lat"], shapeData["center"]["lng"]),
                    radius: shapeData["center"]["radius"],
                    strokeWeight: newstrokeWeight,
                    strokeColor: '#004c80',
                    strokeOpacity: 0.8,
                    fillColor: newColor,
                    fillOpacity: 0.2
                });
            }
            else if(shapeData["shape"] == "RECTANGLE"){
                ret = new daum.maps.Rectangle({
                    bounds : new daum.maps.LatLngBounds(
                        new daum.maps.LatLng(shapeData["path"][0]["lat"], shapeData["path"][0]["lng"]),
                        new daum.maps.LatLng(shapeData["path"][1]["lat"], shapeData["path"][1]["lng"])
                    ),
                    strokeWeight: newstrokeWeight,
                    strokeColor: '#004c80',
                    strokeOpacity: 0.8,
                    fillColor: newColor,
                    fillOpacity: 0.2
                });
            }
            else if(shapeData["shape"] == "POLYGON"){
                var tempPath = [];
                for(var i=0; i<shapeData["path"].length; i++){
                    tempPath[i] = new daum.maps.LatLng(shapeData["path"][i]["lat"], shapeData["path"][i]["lng"]);
                }
                ret = new daum.maps.Polygon({
                    path: tempPath,
                    strokeWeight: newstrokeWeight,
                    strokeColor: '#004c80',
                    strokeOpacity: 0.8,
                    fillColor: newColor,
                    fillOpacity: 0.2
                });
            }

            if (categoryType == "regions"){
                // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다 
                daum.maps.event.addListener(ret, 'mouseover', function(mouseEvent) {
                    //도형이 수정중이 아닌 경우에만 모든 listener enable.
                    if(isModifyRegionShape == false){
                        //ret.setOptions({fillColor: '#0b80'});
                        customOverlay.setContent('<div class="area">' + shapeData["name"] + '</div>');
                    
                        customOverlay.setPosition(mouseEvent.latLng); 
                        customOverlay.setMap(map);
                    }   
                });

                // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다 
                daum.maps.event.addListener(ret, 'mousemove', function(mouseEvent) {
                    //도형이 수정중이 아닌 경우에만 모든 listener enable.
                    if(isModifyRegionShape == false){
                        customOverlay.setPosition(mouseEvent.latLng); 
                    }
                    
                });


                // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
                daum.maps.event.addListener(ret, 'mouseout', function() {
                    //도형이 수정중이 아닌 경우에만 모든 listener enable.
                    if(isModifyRegionShape == false){
                        ret.setOptions({fillColor: '#ffffff'});                        
                    }
                    customOverlay.setMap(null);
                }); 

                daum.maps.event.addListener(ret, 'click', function(mouseEvent) {
                    //도형이 수정중이 아닌 경우에만 모든 listener enable.
                    if(isModifyRegionShape == false && disableAllListener == false){

                        vm.clickName = shapeData["name"];
                        selectedArea = shapeData;
                        if(selectedMarker !== undefined && selectedMarker != null){
                            selectedMarker.setImage(selectedMarker.normalImage)
                        }
                        selectedMarker = printedCategoryMarkers[idx];
                        //console.log(selectedMarker);
                        if(selectedMarker !== undefined && selectedMarker != null){
                            selectedMarker.setImage(clickImage[categoryTypes[idxOfCategory]]);
                        }
                        selectedMarkerIdx = idx;
                        vm.clickUrl =  '../xwiki/bin/view/XWiki/' + vm.clickName;
                        vm.tags = shapeData["tags"];
                        vm.openMapDialog();
                    }    
                });
            }

            return ret;
        };

    

    //-------------확대축소, 사용자 위치 이동 및 깃발, 지도 벗어남 금지, 유저위치 get-----------
        //확대 축소 버튼 
        //var zoomControl = new daum.maps.ZoomControl();
        //map.addControl(zoomControl, daum.maps.ControlPosition.BOTTOMLEFT);

        // Zoom change Listener(zoom 범위 벗어났을대 재조정)
        //zoom_start listener 있음.
        daum.maps.event.addListener(map, 'zoom_changed', function() {        
            var MAX_MAP_LEVEL = 3;
            // 지도의 현재 레벨을 얻어옵니다
            var level = map.getLevel();

            if (level > MAX_MAP_LEVEL){
              map.setLevel(MAX_MAP_LEVEL);
              level = MAX_MAP_LEVEL;
              vm.curMapLevel = MAX_MAP_LEVEL;
            }
            // 지도 중심좌표
            var dragendListenerLatlng = map.getCenter(); 
            var dragendListenerLat = dragendListenerLatlng.getLat();
            var dragendListenerLng = dragendListenerLatlng.getLng();
            
            // 좌표 재설정
            var dragendMoveLatLon = getLatlngInSkkuMap(dragendListenerLat, dragendListenerLng, map.getLevel());
            
            // 재설정된 좌표로 부드러운 이동
            map.panTo(dragendMoveLatLon);
        });

        // Drag 종료 Listener(지도 범위를 벗어났을때 다시 돌아오게함)
        daum.maps.event.addListener(map, 'dragend', function(){
            // 지도 중심좌표
            var dragendListenerLatlng = map.getCenter(); 
            var dragendListenerLat = dragendListenerLatlng.getLat();
            var dragendListenerLng = dragendListenerLatlng.getLng();
            
            // 좌표 재설정
            var dragendMoveLatLon = getLatlngInSkkuMap(dragendListenerLat, dragendListenerLng, map.getLevel());
            
            // 재설정된 좌표로 부드러운 이동
            map.panTo(dragendMoveLatLon);
        });

        //사용자 위치 깃발 image
        var arriveSrc = 'assets/images/marker/blueflag.png', // 도착 마커이미지 주소입니다    
            arriveSize = new daum.maps.Size(50, 45), // 도착 마커이미지의 크기입니다 
            arriveOption = { 
            offset: new daum.maps.Point(15, 43) // 도착 마커이미지에서 마커의 좌표에 일치시킬 좌표를 설정합니다 (기본값은 이미지의 가운데 아래입니다)
        };
        var arriveImage = new daum.maps.MarkerImage(arriveSrc, arriveSize, arriveOption);
        
        //사용자의 위치로 이동한다. 맵의 범위를 벗어나는 경우 표시하지 않는다. 위치로 이동하면서 위치 깃발을 생성한다.
        var arriveMarker = null;
        var isArriveMarkerOn = false;
        vm.moveToUserLocation = function(){
            mapLocation.getLocation();
            //alert(vm.userLat + " " + vm.userLng);
            if(mapLocation.userLastLat != 0 && mapLocation.userLastLng!= 0){
                var dragendListenerLat = angular.copy(mapLocation.userLastLat);
                var dragendListenerLng = angular.copy(mapLocation.userLastLng);
                var dragendMoveLatLon = isLatlngInSkkuMap(dragendListenerLat, dragendListenerLng);
                if(false == dragendMoveLatLon){
                    //alert('out of region');
                }
                else{
                    if(arriveMarker != null){
                        arriveMarker.setMap(null);
                    }
                    if(isArriveMarkerOn == true){
                        isArriveMarkerOn = false;
                    }
                    else{
                        isArriveMarkerOn = true;
                        arriveMarker = new daum.maps.Marker({  
                            position: dragendMoveLatLon,
                            draggable: false, // 도착 마커가 드래그 가능하도록 설정합니다
                            image: arriveImage // 도착 마커이미지를 설정합니다
                        });
                        arriveMarker.setMap(map);
                        map.panTo(dragendMoveLatLon);
                    }
                   
                }
                                
            }
        };

        

//퀵패널 timeline에서 위치 클릭할 경우 그 위치로 지도가 이동합니다. 구역 중심 좌표가 나중에 생기면 그 좌표로 이동하면 될 것 같습니다.

        $scope.$watch(
            function watchEvent(){
                return(peerLocation.eventlocation);
            },
            function handleEvent(newValue, oldValue){
                console.log(peerLocation.eventlocation);
                if(peerLocation.eventlocation.cnt != 0){
                    var resultIdx = -1;
                    resultIdx = searchIdxWithId("regions", peerLocation.eventlocation.l_id);
                        if(resultIdx == -1){
                            alert('맵상에서 검색 결과와 일치하는 결과물을 찾을 수 없습니다.');
                            return;
                        }
                    map.setLevel(1);
                    map.panTo(new daum.maps.LatLng(vm.markerData["regions"][resultIdx]["center"]["lat"], vm.markerData["regions"][resultIdx]["center"]["lng"]));
                }
                
            }, true);

        //Search watch
        
        $scope.$watch(
            function (){
                return(mapLocation.searchResult);
            },
            function (newValue, oldValue){
                console.log(mapLocation.searchResult);
                if(map != null && mapLocation.searchResult["type"] != ""){
                    var resultIdx = -1;
                    
                    map.setLevel(1);    //zoon max
                    //chage state
                    categoryStatusChangeProcess("none", true);
                    if(mapLocation.searchResult["type"] == "event"){
                        categoryStatusChangeProcess("customevent", false);
                        
                        vm.lidForEvent = mapLocation.searchResult["l_id"];
                        vm.eventDataId = mapLocation.searchResult["id"];
                        //selectedMarkerIdx = 0;
                        var resultIdx = -1;
                        //resultIdx = searchIdxWithId("customevent", vm.eventDataId);
                        for(var i=0; i< vm.customEventData.length; i++){
                            if(vm.customEventData[i]['id'] == vm.eventDataId){
                                resultIdx = i;
                                break;
                            }
                        }
                        if(resultIdx == -1){
                            alert('맵상에서 검색 결과와 일치하는 결과물을 찾을 수 없습니다.');
                            return;
                        }
                        selectedMarkerIdx = resultIdx;
                        selectedMarker = printedCategoryMarkers[selectedMarkerIdx];

                        map.panTo(new daum.maps.LatLng(vm.markerData["customevent"][resultIdx]["center"]["lat"],vm.markerData["customevent"][resultIdx]["center"]["lng"]));
                        
                        //open dialog
                        showCustomEventDialog();

                    }
                    else if(mapLocation.searchResult["type"] == "map"){
                        map.panTo(new daum.maps.LatLng(mapLocation.searchResult["lat"], mapLocation.searchResult["lng"]));
                        categoryStatusChangeProcess("regions", false);
                        //search
                        resultIdx = searchIdxWithId("regions", mapLocation.searchResult["id"]);
                        if(resultIdx == -1){
                            alert('맵상에서 검색 결과와 일치하는 결과물을 찾을 수 없습니다.');
                            return;
                        }
                        selectedMarkerIdx = resultIdx;
                        vm.clickName = vm.markerData["regions"][resultIdx]["name"];
                        vm.clickUrl =  '../xwiki/bin/view/XWiki/' + mapLocation.searchResult["name"];
                        vm.tags = vm.markerData["regions"][resultIdx]["tags"];
                        vm.clickUrl =  '../xwiki/bin/view/XWiki/' + vm.markerData["regions"][resultIdx]["name"];
                        selectedMarker = printedCategoryMarkers[selectedMarkerIdx];

                        vm.openMapDialog();
                        //open dialog
                    }
                    else{
                        categoryStatusChangeProcess(mapLocation.searchResult["type"], false);
                        map.panTo(new daum.maps.LatLng(mapLocation.searchResult["lat"], mapLocation.searchResult["lng"]));
                        //search
                        resultIdx = searchIdxWithId(mapLocation.searchResult["type"], mapLocation.searchResult["id"]);
                        if(resultIdx == -1){
                            alert('맵상에서 검색 결과와 일치하는 결과물을 찾을 수 없습니다.');
                            return;
                        }
                        selectedMarkerIdx = resultIdx;
                        selectedMarker = printedCategoryMarkers[selectedMarkerIdx];
                        //open dialog
                        //showCreateCustomMarkerDialog();
                        showMarkerDialog();
                    }

                }
                
            }, true);
        



        //id와 status로 마커 정보가 담긴 vm.markerData에서의 위치(idx)를 검색한다. idx = selectedMarkerIdx
        function searchIdxWithId(status, id){
            for(var i=0; i<vm.markerData[status].length; i++){
                if(vm.markerData[status][i]["id"] == id){
                    return i;
                }
            }
            return -1;
        }

    //---------------구역 다이얼로그 - 칩, 컨트롤러, 다이얼로그 --------------------------------------

        var selectedArea = null;
        var printedArea = [];
        var areas = [
        
        ];

        vm.tags = [];

        vm.openMapDialog = function(ev)
        {
            $mdDialog.show({
                controller         : MapDialogController,
                templateUrl        : 'app/main/map/map-dialog.html',
                parent             : angular.element(document.body),
                targetEvent        : ev,
                clickOutsideToClose: true,
                fullscreen: false, // Only for -xs, -sm breakpoints.
                resolve: {
                    inData : function(){
                        return vm.markerData["regions"][selectedMarkerIdx];
                    },
                    clickName: function(){
                        return vm.clickName;
                    },
                    clickUrl: function(){
                        return vm.clickUrl;  
                    },
                    tags: function(){
                        return vm.tags;
                    }
                }
            })
            .then(function(answer){
                if(answer == 'markerInfo'){
                    showRegionDialog();
                }
                else if(answer == "makeEvent"){
                    vm.lidForEvent = vm.markerData["regions"][selectedMarkerIdx]["id"];
                    showCreateCustomEventDialog();
                }
            }, function(){});
        }

        //구역 폴리곤 클릭 시 다이얼로그 컨트롤러 
        function MapDialogController($scope, $mdDialog, $state, clickName) {
            $scope.canMakeEvent = false;
            if(vm.categoryStatus == "regions"){
                $scope.canMakeEvent = true;
            }

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
            $scope.movewiki = function(){  //wiki page로 이동 
                $mdDialog.cancel();
                $rootScope.wikipath = vm.clickUrl;
 
                if($state.includes('app.wiki') == true)
                {
                    $state.reload();
                }
                else
                {
                    $state.go('app.wiki');
                }
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.clickName = vm.clickName;
            $scope.clickUrl = vm.clickUrl;
            $scope.tags = [];
            $scope.tags = vm.tags; 
        }

    //-------------mapLocation service에 주기적으로 map 상태 갱신하기-------------------
        $interval(updateMapLocationService, 1000); 
        function updateMapLocationService() {
            mapLocation.lastLat = map.getCenter().getLat();
            mapLocation.lastLng = map.getCenter().getLng();
            mapLocation.lastZoomLevel = map.getLevel();
            mapLocation.lastCategoryStatus = vm.categoryStatus;
        }

    //----------------------------------친구 위치 맵에 올리기-----------------------------------------
    
        var arrIdx = 0;                         //peerCustomOverlay[]의 index
        var peerTransparentImageSrc = 'assets/images/marker/marker_avatar_transparent.png', // 마커이미지의 주소입니다    
            peerTransparentImageSize = new daum.maps.Size(35, 35), // 마커이미지의 크기입니다
            peerTransparentImageOption = {offset: new daum.maps.Point(21, 18)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
        // 투명 avatar 마커 이미지 생성
        var peerTransparentMarkerImage = new daum.maps.MarkerImage(peerTransparentImageSrc, peerTransparentImageSize, peerTransparentImageOption);
        
        var isNowUsingPeerClusterOverlay = false;

        var peerClusterOverlay = [];
        
        var timerPeerClusterOverlay;
        var isTimerPeerClusterOverlayOn = false;

        /*function removePeerClusterOverlay(){
            if(isNowUsingPeerClusterOverlay == true){   //create 도중 remove 인 경우
                return;
            }
            isNowUsingPeerClusterOverlay = true;
            for(var i=0; i<peerClusterOverlay.length ;i++){
                //unset peerclusteroverlay

            }
            isNowUsingPeerClusterOverlay = false;
        }
            

        function makePeerClusterOverlay(lat, lng) {
            if(isNowUsingPeerClusterOverlay == true){   //remove 도중 makePeer 인경우 remove 실행&create shutdown
                return;
            }
            //create peer at lat, lng
            var clusterLen = peerClusterOverlay.length;
            //오버레이 생성
            peerClusterOverlay[clusterLen] = 1;


            if (isTimerPeerClusterOverlayOn == true) {
                clearTimeout(timerPeerClusterOverlay);
            }
            isTimerPeerClusterOverlayOn = true;
            timerPeerClusterOverlay = setTimeout(function(){
                removePeerClusterOverlay();
                isTimerPeerClusterOverlayOn = false;
                }, 12000);
        }*/

         function createPeerMarkerAndOverlay(){
            for (var value in peerLocation.peer.active){
                var tempUser = peerLocation.peer.active[value];
                //lat, lng, name, nickname,profileImgPath, memSeq, checked exists

                if(tempUser.checked == true){
                    var peerContent = '<div><img class="avatar" src="' + tempUser["profileImgPath"] + '"' + '</img></div>';
                    var peerPosition = new daum.maps.LatLng(tempUser.lat, tempUser.lng);
                    var peerCustomOverlay = new daum.maps.CustomOverlay({
                        position: peerPosition,
                        content: peerContent,
                        xAnchor: 0.5,
                        yAnchor: 0.5
                    });        
                
                    var peerTransparentMarker = new daum.maps.Marker({
                            position: peerPosition, 
                            image: peerTransparentMarkerImage, // 마커이미지 설정 
                            title: tempUser.nickname
                        });

                    peerCustomOverlay.setMap(map);
                    peerOnMapCustomOverlays[arrIdx] = peerCustomOverlay;
                    peerTransparentMarker.setMap(map);
                    peerOnMapTransparnetMarkers[arrIdx] = peerTransparentMarker;
                }
            }
        }

        vm.peerOnMapFunciton = function(){
            console.log(peerLocation.peer);
            //remove all peers on map
            console.log(peerLocation.peer.active);
            for(var value = 0; value < arrIdx; ++value){
                peerOnMapCustomOverlays[value].setMap(null);
                peerOnMapTransparnetMarkers[value].setMap(null);
            }//
            arrIdx = 0;

            //on off isPeerOnMap
            if(isPeerOnMap == true){
                isPeerOnMap = false;
            }
            else{
                    isPeerOnMap = true;
                    createPeerMarkerAndOverlay();
            }    
        };

        

        // peer 변경 감시(watch)하고 맵에 올라가는 사진을 갱신한다
        $scope.$watch(function() { return peerLocation.peer}, function(newVal) {
            if(isPeerOnMap == true){
                vm.peerOnMapFunciton();
                vm.peerOnMapFunciton();   
            }

        }, true);

        createCategoryMarkersInJson();  //처음 페이지 진입 시 카테고리 별 마커 및 도형을 미리 만듭니다.
        categoryStatusChangeProcess(mapLocation.lastCategoryStatus); 

    //----------------------------DATA COMMUNICATION--------------------------
        function refreshRegionData(targetState){
            
            var deferred = $q.defer();
            var httpProm1 = GetAreaAdmin();
            var httpProm2 = GetAreaUser();

            //두 약속을 $q.all 메서드를 이용해 새로운 약속을 만든다.
            $q.all([httpProm1, httpProm2])
            .then(
                function(results) {
                //두 약속이 모두 지켜지면 asyncService서비스가 반한하는 약속을 지키고 두 약속이 전달하는 결과를 묶은 배열로 전달한다.
                    deferred.resolve(results);
                    areaAdmin = results[0];
                    areaUser = results[1];
                    subAreaData = makeSubAreaData(areaAdmin, areaUser);
                    categoryStatusChangeProcess("none", true);
                    createCategoryMarkersInJson();
                    categoryStatusChangeProcess(targetState, false);
                },
                function(errors) {
                    deferred.reject(errors);
                },
                function(updates) {
                    deferred.update(updates);
            });
        }
        function refreshCustomEventData(targetState){
            var respo = GetCustomEventData();
            respo.then( 
                function successFunc(response){
                    vm.customEventData = response.data;
                    categoryStatusChangeProcess("none", true);
                    createCategoryMarkersInJson();
                    categoryStatusChangeProcess(targetState, false);
                },
                 function failFunc(response){
                    console.log(response);
                });
        }

        function makeSubAreaData(adminData, userData){
            var adminObj = adminData.data;
            var userObj = userData.data;
            var adminObjLen = adminObj.length;
            for(var i=0; i<adminObjLen; i++){
                adminObj[i]["type"] = "admin";
            }

            for (var i=0; i<userObj.length; i++){
                userObj[i]["type"] = "user";
                adminObj[adminObjLen] = userObj[i];
                adminObjLen++;
            }

            return adminObj;

        }

        function GetAreaAdmin(){
            return $http({
                method: 'GET',
                url: './api/map?type=admin',
                headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
            });
        }

        function GetAreaUser(){
            return $http({
                method: 'GET',
                url: './api/map?type=user',
                headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
            });
        }          

        
        function PostAreaUser(inData){
            var strObj = JSON.stringify(inData);
            return $http({
                method: 'POST',
                url: './api/map',
                data : JSON.stringify(inData),
                headers: {
                'x-auth-token': $sessionStorage.get('AuthToken')
                        },
                transformResponse: [function (data) {
                    return data;
                }]
                });

                
        }
        function PutAreaUser(inData){
            var putid = inData["id"];
            delete inData["id"];
            return $http({
                method: 'PUT',
                url: './api/map' + '/' + putid,
                data : JSON.stringify(inData),
                headers: {'x-auth-token': $sessionStorage.get('AuthToken'),
                        },
                transformResponse: [function (data) {
                    return data;
                }]
            });
        }
        function DeleteAreaUser(inData){
            var delid = inData["id"];
            return $http({
                method: 'DELETE',
                url: './api/map' + '/' + delid,
                headers: {'x-auth-token': $sessionStorage.get('AuthToken') },
                transformResponse: [function (data) {
                    return data;
                }]
            });
        }


        function GetCustomEventData(){
            return $http({
                method: 'GET',
                url: './api/event',
                headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
            });
        }

        function PostCustomEventData(inData){
            console.log(inData);
            if(inData["l_id"] < 1){
                console.log("l_id error");
                return;
            }
            return $http({
                method: 'POST',
                url: './api/event',
                data : JSON.stringify(inData),
                headers: {
                'x-auth-token': $sessionStorage.get('AuthToken')
                        },
                transformResponse: [function (data) {
                    return data;
                }]
                });

        }

        function PutCustomEventData(inData){
            
            if(inData["l_id"] < 1){
                console.log("l_id error");
                return;
            }
            //$scope.retData["creator"]["memberSeq"] = $sessionStorage.get('memberSeq');
            var putid = inData["id"];
            var putData = angular.copy(inData);
            delete putData["id"];
            delete putData["creator"];
            console.log(putData);
            //inData["creator"] = {};
            //inData["creator"]["memberSeq"] = $sessionStorage.get('memberSeq');

            return $http({
                method: 'PUT',
                url: './api/event' + '/' + putid,
                data : JSON.stringify(putData),
                headers: {'x-auth-token': $sessionStorage.get('AuthToken'),
                        },
                transformResponse: [function (data) {
                    return data;
                }]
            });

        }

        function DeleteCustomEventData(inData){
            var delid = inData["id"];
            return $http({
                method: 'DELETE',
                url: './api/event' + '/' + delid,
                headers: {'x-auth-token': $sessionStorage.get('AuthToken') },
                transformResponse: [function (data) {
                    return data;
                }]
            });
        }

        function GetCustomMarkerData(types){
            return $http({
                method: 'GET',
                url: './api/marker?q=' + types,
                headers: {'x-auth-token': $sessionStorage.get('AuthToken')},
                transformResponse: [function (data) {
                    return data;
                }]
            });
        }

        function refreshCustomMarkerData(types, noChange){
            var respo = GetCustomMarkerData(types);
            respo.then( 
                function successFunc(response){
                    var data = JSON.parse(response.data);
                    
                    markerDataSkeleton[types] = [];
                    for(var i = 0; i < data.length; i++){
                        markerDataSkeleton[types][i] = data[i];
                    }
                    if(noChange == false){
                        categoryStatusChangeProcess("none", true);
                        createCategoryMarkersInJson();
                        categoryStatusChangeProcess(types, false);
                    }    
                },
                 function failFunc(response){
                    console.log(response);
                }); 
        }

        function PostCustomMarkerData(inData){
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

        }

        function PutCustomMarkerData(inData){
            var putid = inData["id"];
            var putData = angular.copy(inData);
            delete putData["id"];
            delete putData["center"]["id"];
            delete putData["markerCategory"]["id"];
            console.log(putData);
            //putData["center"] = {};
            /*putData["center"] = inData["center"];
            putData["markerCategory"] = inData["markerCategory"];

            var putid = inData["id"];
            delete putData["id"];
            delete putData["center"]["id"];
            delete putData["markerCategory"]["id"];
            console.log(putData);
            */
            return $http({
                method: 'PUT',
                url: './api/marker' + '/' + putid,
                data : JSON.stringify(putData),
                headers: {'x-auth-token': $sessionStorage.get('AuthToken'),
                        },
                transformResponse: [function (data) {
                    return data;
                }]
            });

        }

        function DeleteCustomMarkerData(inData){
            var delid = inData["id"];
            return $http({
                method: 'DELETE',
                url: './api/marker' + '/' + delid,
                headers: {'x-auth-token': $sessionStorage.get('AuthToken') },
                transformResponse: [function (data) {
                    return data;
                }]
            });
        }

        categoryStatusChangeProcess("regions", false);

    }
    
//------controller scope 밖 function

    //마커가 drawingObj, shapeType에 해당하는 도형 안에 존재하는지 확인.
    function isMarkerInShape(markerLat, markerLng, drawingObj, shapeType){ //drawingObj = curDrawingObj[shapeType][0]
        if(shapeType == "circle"){
            var X = (drawingObj["center"]["x"]-markerLng);
            var Y = (drawingObj["center"]["y"]-markerLat);
            var dit = drawingObj["radius"]/100000;
            if( (X*X + Y*Y) > dit*dit){
                return false;
            }
        }
        else if(shapeType == "rectangle"){
            if(markerLng<drawingObj["sPoint"]["x"] || markerLng>drawingObj["ePoint"]["x"]
                || markerLat < drawingObj["sPoint"]["y"] || markerLat > drawingObj["ePoint"]["y"]){
                return false;
            }
        }
        else if(shapeType == "polygon"){
            var i, j = drawingObj["points"].length-1;
            var oddNodes = false;
            // polyX[] = lat, polyY[] = lng
            for (i=0; i<drawingObj["points"].length; i++) {
                var polyYI = drawingObj["points"][i]["x"];
                var polyYJ = drawingObj["points"][j]["x"];
                var polyXI = drawingObj["points"][i]["y"];
                var polyXJ = drawingObj["points"][j]["y"];
                if ((polyYI < markerLng && polyYJ >= markerLng || polyYJ < markerLng && polyYI >= markerLng)
                    && (polyXI <= markerLat || polyXJ <= markerLat)) {
                    if (polyXI+(markerLng-polyYI)/(polyYJ-polyYI)*(polyXJ-polyXI)<markerLat) {
                        oddNodes=!oddNodes; 
                    }
                }
                j = i;
            }
            return oddNodes;
        }
        else{
            return false;   //이외의 도형.
        }
        return true;
    }

    //주어진 좌표를 맵에서 벗어나지 않도록 재조정된 값을 return.
    function getLatlngInSkkuMap(lat, lng, level){
        var dat = 0;
        if(level == 2){
            dat = 0.0004;
        }
        else if(level == 3){
            dat = 0.0024;
        }
        // 범위 최대 최소 좌표
        var MAX_LAT = 37.2980-dat, MIN_LAT = 37.2907+dat, MAX_LNG = 126.9783-dat, MIN_LNG = 126.97+dat;

        // 지도 중심좌표 
        var dragendListenerLat = lat;
        var dragendListenerLng = lng;
        if (dragendListenerLat > MAX_LAT)
            dragendListenerLat = MAX_LAT;
        else if(dragendListenerLat < MIN_LAT)
            dragendListenerLat = MIN_LAT;

        if(dragendListenerLng > MAX_LNG)
            dragendListenerLng = MAX_LNG;
        else if(dragendListenerLng < MIN_LNG)
            dragendListenerLng = MIN_LNG;

        // 좌표 재설정
        var dragendMoveLatLon = new daum.maps.LatLng(dragendListenerLat, dragendListenerLng);

        // 재설정된 좌표로 부드러운 이동
        //map.panTo(dragendMoveLatLon);

        return dragendMoveLatLon;
    }

    //주어진 좌표가 범위 내에 존재하면 좌표를 return하고 아닌 경우 false return.
    function isLatlngInSkkuMap(lat, lng){
        // 범위 최대 최소 좌표
        var MAX_LAT = 37.3, MIN_LAT = 37.29, MAX_LNG = 126.979, MIN_LNG = 126.965;
        // 지도 중심좌표 
        var dragendListenerLat = lat;
        var dragendListenerLng = lng;
        if (dragendListenerLat > MAX_LAT)
            return false;
        else if(dragendListenerLat < MIN_LAT)
            return false;

        if(dragendListenerLng > MAX_LNG)
            return false;
        else if(dragendListenerLng < MIN_LNG)
            return false;

        // 좌표 재설정
        var dragendMoveLatLon = new daum.maps.LatLng(dragendListenerLat, dragendListenerLng);

        // 재설정된 좌표로 부드러운 이동
        //map.panTo(dragendMoveLatLon);
        return dragendMoveLatLon;
    }
    function createMarkerData(data, skeleton){
        for(var i=0; i<data.length; i++){
            var inLen = skeleton[data[i]["category"]].length
            skeleton[data[i]["category"]][inLen] = {"name" : data[i]["name"], "center" : data[i]["center"]}; 
        }
        return skeleton;
    }

    

})();