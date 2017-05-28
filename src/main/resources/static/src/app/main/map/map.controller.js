(function ()
{
    'use strict';


    angular
        .module('app.map')
        .controller('MapController', MapController);


    /** @ngInject */
    function MapController($mdDialog, CustomEventMarkerData, SubAreaData, CategoryMarkerData, MarkerData, $scope, $interval, $timeout, peerLocation, mapLocation, $sessionStorage, $state)
    {
        var vm = this;
        vm.markerData = MarkerData.data;
        vm.clickName = "none"; //클릭한 구역 폴리곤(area)의 name
        vm.clickUrl = "http://fanatic1.iptime.org:8080/xwiki/bin/view/XWiki/";
        var tempint = 10;
        vm.userLat = 0;
        vm.userLng = 0;
        vm.curMapLevel = 3;     //현재 지도의 zoom level
        //category status type : {bank, toilet, print, busstop, vendingmachine}, {insideRestaurant, outsideRestaurant}, {standard, engineer, comm, soft}, group, region
        vm.categoryStatus = mapLocation.lastCategoryStatus; 
        var categoryStatusMutex = 0;    //뮤텍스
        var container = document.getElementById('map');
        var options = {
            center: new daum.maps.LatLng(mapLocation.lastLat, mapLocation.lastLng),
            level: mapLocation.lastZoomLevel
        };

        var map = new daum.maps.Map(container, options),
        customOverlay = new daum.maps.CustomOverlay({}),
        infowindow = new daum.maps.InfoWindow({removable: true});

        //-------------------------------custom evnet Drawing---------------------------------------
        //vm.customEventData = CustomEventData.data;
        var drawingManager = null;
        vm.customEventMarkerData = CustomEventMarkerData.data;

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

        //로그인 되어있지 않은 사용자가 맵에 접근시 로그인 페이지로 돌려보냄
        
        function usercheck(){
            var userval = $sessionStorage.get('useremail');
            if(userval == undefined){
                alert('로그인 되어 있지 않거나 세션 유효기간이 끝나 로그아웃 되었습니다.');
                $state.go('login');
            }
        };
        usercheck();



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
        
        $interval(function(){
            console.log(vm.categoryStatus);
        }, 1000); 
        // 위에 작성한 옵션으로 Drawing Manager를 생성합니다
        drawingManager = new daum.maps.Drawing.DrawingManager(drawCustomEvnetOptions);
        vm.makeCustomEventDetail = function(answer){
            //answer route : CreateCustomEventDialogController->vm.showCreateCustomEventDialog->this
            //var answer = {"title" : $scope.title, "detailed" : $scope.detailed};
            //vm.categoryStatus = "none";
            categoryStatusChangeProcess("none");
            var curDrawingObj = drawingManager.getData();
            //register custom event
            var newCustomEventObj = {
                "name": answer["title"],
                "lat": curDrawingObj["marker"][0]["y"],
                "lng": curDrawingObj["marker"][0]["x"],
                "type" : "none",
                "detailed" : answer["detailed"]         
            };

             //도형별 데이터를 생성하면서 그려진 overlay 제거한다.
            var drawingManagerOverlays = drawingManager.getOverlays();
            drawingManager.remove(drawingManagerOverlays["marker"][0]);

            if(curDrawingObj["circle"].length != 0){
                newCustomEventObj["type"] = "CIRCLE";
                newCustomEventObj["circleLat"] = curDrawingObj["circle"][0]["center"]["y"];
                newCustomEventObj["circleLng"] = curDrawingObj["circle"][0]["center"]["x"];
                newCustomEventObj["circleRadius"] = curDrawingObj["circle"][0]["radius"];
                //drawingManager.remove(drawingManagerOverlays["circle"][0]);
            }
            else if(curDrawingObj["rectangle"].length != 0){
                newCustomEventObj["type"] = "RECTANGLE";
                newCustomEventObj["rectangleSPointLat"] = curDrawingObj["rectangle"][0]["sPoint"]["y"];
                newCustomEventObj["rectangleSPointLng"] = curDrawingObj["rectangle"][0]["sPoint"]["x"];
                newCustomEventObj["rectangleEPointLat"] = curDrawingObj["rectangle"][0]["ePoint"]["y"];
                newCustomEventObj["rectangleEPointLng"] = curDrawingObj["rectangle"][0]["ePoint"]["x"];
                drawingManager.remove(drawingManagerOverlays["rectangle"][0]);
            }
            else if(curDrawingObj["polygon"].length != 0){
                newCustomEventObj["type"] = "POLYGON";
                newCustomEventObj["polygonPath"] = [];
                for(var i = 0; i< curDrawingObj["polygon"][0]["points"].length; i++){
                    newCustomEventObj["polygonPath"][i] = {"lat" : curDrawingObj["polygon"][0]["points"][i]["y"], "lng" : curDrawingObj["polygon"][0]["points"][i]["x"]};
                }
                drawingManager.remove(drawingManagerOverlays["polygon"][0]);
            }

            //TODO : register newCustomEventObj on client data + server data
            var customLen = vm.markerData["customevent"].length;
            //vm.markerData에 현재 data 추가.
            vm.markerData["customevent"][customLen] = newCustomEventObj;
            //markerData에 있는 데이터를 기반으로 마커 재작성.
            createCategoryMarkersInJson();
            categoryStatusChangeProcess("customevent");
            //vm.categoryStatus = "customevent";
            
        }

        //커스텀이벤트 생성 다이얼로그
        vm.showCreateCustomEventDialog = function(ev) {
            $mdDialog.show({
                controller: CreateCustomEventDialogController,
                templateUrl: 'app/main/map/dialogCreateCustomEvent.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: false // Only for -xs, -sm breakpoints.
            })
            .then(function(answer) {
                //alert(answer);
                vm.makeCustomEventDetail(answer);
            }, function() {
                alert('none..');
            });
        };


        function CreateCustomEventDialogController($scope, $mdDialog) {
            $scope.title = "";
            $scope.detailed = "";
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function() {
                var answer = {"title" : $scope.title, "detailed" : $scope.detailed};
                $mdDialog.hide(answer);
            };
        }
        // 버튼 클릭 시 호출되는 핸들러 입니다
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
                    else{
                        //make dialog //생성 및 등록
                        vm.showCreateCustomEventDialog();
                    }
                }
                else{
                    alert('need to make at least 1 marker and 1 region');
                }
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

                // 클릭한 그리기 요소 타입을 선택합니다
                drawingManager.select(daum.maps.Drawing.OverlayType[type]);
            }
            
        }
                  //-----------------구역 다이얼로그 - 칩, 컨트롤러, 다이얼로그 ---------------------------

        vm.tags = [];

        vm.openMapDialog = function(ev)
        {
            $mdDialog.show({
                controller         : MapDialogController,
                controllerAs       : 'vm',
                templateUrl        : 'app/main/map/map-dialog.html',
                parent             : angular.element(document.body),
                targetEvent        : ev,
                clickOutsideToClose: true,
                fullscreen: false, // Only for -xs, -sm breakpoints.
                resolve: {
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
            });
        }

        //구역 폴리곤 클릭 시 다이얼로그 컨트롤러 
        function MapDialogController($scope, $mdDialog, $state, clickName) {
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
            $scope.movewiki = function(){  //wiki page로 이동 
                $mdDialog.cancel();
                $state.go('app.wiki');
                //$state.go(vm.clickUrl);
            };
            $scope.clickName = vm.clickName;
            $scope.clickUrl = vm.clickUrl;
            $scope.tags = vm.tags; 
        }

        //---------------------------------mapLocation service에 주기적으로 map 상태 갱신하기-------------------
        $interval(updateMapLocationService, 10000); 
        function updateMapLocationService() {
            mapLocation.lastLat = map.getCenter().getLat();
            mapLocation.lastLng = map.getCenter().getLng();
            mapLocation.lastZoomLevel = map.getLevel();
            mapLocation.lastCategoryStatus = vm.categoryStatus;
        }

        //----------------------------------친구 위치 맵에 올리기-----------------------------------------
        var isPeerOnMap = false;                //peer가 맵 위에 있는지 여부
        var peerOnMapCustomOverlays = [];       //현재 맵 위에 있는 peer custom overlay들.
        var peerOnMapTransparnetMarkers = [];   //현재 맵 위에 있는 투명 markers
        var arrIdx = 0;                         //peerCustomOverlays[]의 index
        var peerTransparentImageSrc = 'assets/images/marker/marker_avatar_transparent.png', // 마커이미지의 주소입니다    
            peerTransparentImageSize = new daum.maps.Size(35, 35), // 마커이미지의 크기입니다
            peerTransparentImageOption = {offset: new daum.maps.Point(21, 18)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
        // 투명 avatar 마커 이미지 생성
        var peerTransparentMarkerImage = new daum.maps.MarkerImage(peerTransparentImageSrc, peerTransparentImageSize, peerTransparentImageOption);
                        
        
        vm.peerOnMapFunciton = function(){
            //remove all peers on map
            for(var value = 0; value < arrIdx; ++value){
                peerOnMapCustomOverlays[value].setMap(null);
            }
            arrIdx = 0;

            //on off isPeerOnMap
            if(isPeerOnMap == true){
                isPeerOnMap = false;
            }
            else{
                isPeerOnMap = true;
                //peer type == Studnet
                for (var value in peerLocation.peer.location["ST"]){
                    if(peerLocation.peer.location["ST"][value].checked == true){
                        var peerContent = '<div><img class="avatar" src="'+
                        peerLocation.peer.location["ST"][value].avatar+
                        '"></img></div>';
                        var peerPosition = new daum.maps.LatLng(peerLocation.peer.location["ST"][value].locationx, peerLocation.peer.location["ST"][value].locationy);
                        var peerCustomOverlay = new daum.maps.CustomOverlay({
                            position: peerPosition,
                            content: peerContent,
                            xAnchor: 0.5,
                            yAnchor: 0.5
                        });
                        
                        var peerTransparentMarker = new daum.maps.Marker({
                            position: peerPosition, 
                            image: peerTransparentMarkerImage, // 마커이미지 설정 
                            title: peerLocation.peer.location["ST"][value].name
                        });

                        peerCustomOverlay.setMap(map);
                        peerOnMapCustomOverlays[arrIdx] = peerCustomOverlay;
                        peerTransparentMarker.setMap(map);
                        peerOnMapTransparnetMarkers[arrIdx] = peerTransparentMarker;
                        arrIdx++;
                    }
                }
                //peer type == Professor
                for (var value in peerLocation.peer.location["PF"]){
                    if(peerLocation.peer.location["PF"][value].checked == true){
                        var peerContent = '<div><img class="avatar" src="'+
                        peerLocation.peer.location["PF"][value].avatar+
                        '"></img></div>';
                        var peerPosition = new daum.maps.LatLng(peerLocation.peer.location["PF"][value].locationx, peerLocation.peer.location["PF"][value].locationy);
                        var peerCustomOverlay = new daum.maps.CustomOverlay({
                            position: peerPosition,
                            content: peerContent,
                            xAnchor: 0.5,
                            yAnchor: 0.5
                        });

                        peerCustomOverlay.setMap(map);
                        peerOnMapCustomOverlays[arrIdx++] = peerCustomOverlay;
                    }
                }
            }
        };


        // peer 변경 감시(watch)
        $scope.$watch(function() { return peerLocation.peer}, function(newVal) {
            if(isPeerOnMap == true){
                vm.peerOnMapFunciton();
                vm.peerOnMapFunciton();   
            }
        }, true);

        //----------------------------------마커 다이얼로그 --------------------------------

        vm.showMarkerDialog = function(ev) {
            $mdDialog.show({
                controller: MarkerDialogController,
                templateUrl: 'app/main/map/markerDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: false // Only for -xs, -sm breakpoints.
            })
            .then(function(answer) {
                alert('answer');
            }, function() {
                alert('none..');
            });
        };


        function MarkerDialogController($scope, $mdDialog) {
            $scope.data = selectedMarker.getTitle();
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


        //----------------------------------카테고리 선택 메뉴 -------------------------------
        var categoryLevel = "none";
        vm.categoryMenu = CategoryMarkerData.data;

        //answer가 leaf category(categoryTypes 배열의 요소)에 없으면 categoryLevel에 해당.
        vm.categorySelect = function(answer){
            if(-1 != categoryTypes.indexOf(answer)){
                //vm.categoryStatus = answer;
                categoryStatusChangeProcess(answer);             
            }
            //inner에 해당하는 object 배열을 categoryLevel로 만든다.
            else{
                var idx = 0;
                for(idx = 0; idx < vm.categoryMenu.length; idx++){
                    if(vm.categoryMenu[idx]["type"] == answer){
                        break;
                    }
                }
                vm.categoryLevel = vm.categoryMenu[idx]["inner"];
                $timeout(function () {
                    vm.categoryIsOpen = true;
                }, 600);
            }
        }
        vm.categoryLevel = "none";  //카테고리 버튼의 세부 레벨(편의시설 - 다음 level)
        vm.categoryIsOpen = false;  //카테고리 버튼의 open 여부 bind
        vm.tooltipVisible = false;  //카테고리 툴팁의 visible 여부 bind
        vm.returnToNone = false;    //카테고리 세부 레벨 초기화 여부
        var catCount = 0;   //카테고리 한번 더 누를 시 마커 제거

        //카테고리 버튼 클릭 함수. 특정 카테고리 마커가 생성된 경우 이를 제거한다.
        vm.categoryFabClicked = function(){
            if(vm.categoryStatus != "none"){
                //none 상태가 아닌경우 catCount가 0인경우 방금 categoryStatus가 select된 상태임.
                if(catCount == 0)
                    catCount++;
                else{   //none이 아닌 다른 status 상태에서 category 버튼이 눌림.
                    //vm.categoryStatus = "none";
                    categoryStatusChangeProcess("none");
                    catCount = 0;
                    console.log("none is called!" + catCount);
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
                }
               
            }
            else{   //외부에서 status가 변한 상태일 수 있으므로 catCount를 초기화.
                vm.categoryIsOpen = !vm.categoryIsOpen;
                catCount = 0;
            }
        }

        //카테고리 툴팁 띄우기 지연
        $scope.$watch(function() { return vm.categoryIsOpen}, function(newVal) {
            if (newVal) {
                $timeout(function() {
                    vm.tooltipVisible = vm.categoryIsOpen;     //delay open
                    if(vm.categoryLevel != "none")  
                        vm.returnToNode = true;     //버튼 open시 카테고리 레벨이 "none"이 아니면 close시 none 레벨로 돌아간다.
                    else
                        vm.returnToNode = false;
                }, 600);
            } else {
                    vm.tooltipVisible = vm.categoryIsOpen;     //delay 없이 바로 close
                    if(vm.categoryLevel != "none" && vm.returnToNode == true)
                        vm.categoryLevel = "none";
            }
        }, true);

        //카테고리 툴팁 고정
        $scope.$watch(function() { return vm.tooltipVisible}, function(newVal) {
            if(vm.categoryIsOpen){
                vm.tooltipVisible = vm.categoryIsOpen;
            }
        }, true);

        //구역 클릭시 다이얼로그 
        vm.showDetailed = function(ev) {
            $mdDialog.show({
                controller: DetailedDialogController,
                templateUrl: 'app/main/map/dialog2.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: false, // Only for -xs, -sm breakpoints.
                resolve: {
                  clickName: function(){
                    return vm.clickName;
                  }
                }
            })
        };

//-------------------------------------카테고리 마커 출력-----------------------------------------------
        /*
        카테고리 등록하는법.
        1. marker Json 파일의 data object에 categoryName : [{}, {} ...] 추가
        2. sprites 이미지에 해당하는 마커 이미지 추가(SPRITE_WIDTH, SPRITE_HEIGHT 변경 필수)
        3. categoryTypes[]에 추가하고자 하는 category name 추가.
        4. category dialog에서 해당 카테고리 선택시 vm.categoryStatus를 categoryName으로 변경
        *. categoryTypes[]와 sprites 이미지 순서가 같아야함. JSON 파일 카테고리 순서는 무관.
        */

        var printedCategoryMarkers = [];
        var customEventShapes = []; //customEvent region 도형들을 담는다.
        // 마커 클러스터러를 생성합니다 
        var clusterer = new daum.maps.MarkerClusterer({
            map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체 
            averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정 
            minLevel: 3 // 클러스터 할 최소 지도 레벨 
        });
        //categoryStatus를 바꿀 때 반드시 이 함수를 통해 교체. Watch는 sync 문제로 인해 제거.
        function categoryStatusChangeProcess(status){
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
            }
        };
        /*
        $scope.$watch(function() { return vm.categoryStatus}, function(newVal, oldVal) {
            //선택된 marker의 clicked image상태를 normal image로 되돌려놓는다.
            if(selectedMarker != null){
                selectedMarker.setImage(selectedMarker.normalImage);
                selectedMarker = null;
            }   
            //delete all marker on map. Init printedCategoryMarkers
            for(var i=0; i<printedCategoryMarkers.length; i++){
                printedCategoryMarkers[i].setMap(null);
            }
            printedCategoryMarkers = [];
            for(var i=0; i<customEventShapes.length; i++){
                customEventShapes[i].setMap(null);
            }
            //카테고리가 정해져있으면 printedCategoryMarkers에 해당 카테고리 마커들을 저장하고 출력한다.
            if(vm.categoryStatus != "none"){
                for(var i=0; i<categoryMarkers[vm.categoryStatus].length; i++){
                    categoryMarkers[vm.categoryStatus][i].setMap(map);
                    printedCategoryMarkers[i] =  categoryMarkers[vm.categoryStatus][i];
                }
                //customevent의경우 추가적으로 도형 생성
                if(vm.categoryStatus == "customevent"){
                    for(var i=0; i<customEventShapes.length; i++){
                        customEventShapes[i].setMap(map);
                    }
                }
            }
            categoryStatusMutex = 0;
        }, true);
        */

        //Marker Image Process------------------------------------------
       
        var categoryTypes = ["bank", "toilet", "busstop", "print", "vendingmachine", "insideRestaurant", "regions", "customevent"];
        var categoryMarkers = {};   
        var selectedMarker = null; // 클릭한 마커를 담을 변수

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
            SPRITE_MARKER_URL = 'assets/images/marker/marker_sprites_transparent.png', // 스프라이트 마커 임시 이미지 URL
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

        //marker creation process about category(image, clickListener...)
        var createCategoryMarkers = function(typeI, typeIdx) {
        // 마커를 생성하고 이미지는 해당 카테고리의 마커 이미지를 사용합니다
            var marker = new daum.maps.Marker({
                position: new daum.maps.LatLng(vm.markerData[categoryTypes[typeI]][typeIdx]["lat"], vm.markerData[categoryTypes[typeI]][typeIdx]["lng"]),
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
                    //customEventShapes[typeIdx].setMap(null);
                    customEventShapes[typeIdx].setOptions({
                        strokeWeight: 2,
                        strokeColor: '#ee7300',
                        strokeOpacity: 0.8,
                        strokeStyle: 'dashed',
                        fillColor: '#eea600',
                        fillOpacity: 0.8
                    });
                    //customEventShapes[typeIdx].setMap(map);
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
                        fillOpacity: 0.4
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
                //dialog 띄우기
                vm.showMarkerDialog();
            });

            //생성한 마커를 categoryMarkers에 저장.
            categoryMarkers[categoryTypes[typeI]][typeIdx] = marker;
        };

        function createCategoryMarkersInJson(){
            customEventShapes = []; //init customEventShapes
            //marker.json 정보에서 categoryMarkers obj 생성.
            for(var i = 0; i<categoryTypes.length; i++){
                //set empty array in categoryMarkers{"categoryType" : [], "categoryType2" : [] ...}
                categoryMarkers[categoryTypes[i]] = [];   
                //카테고리 타입별 위치정보 개수 만큼 loop
                for(var idx = 0; idx< vm.markerData[categoryTypes[i]].length; idx++){
                    if(categoryTypes[i] == "customevent"){
                        customEventShapes[idx] = createCustomEventShape(idx);
                    }
                    createCategoryMarkers(i, idx);
                }
            }
        };
        
        function createCustomEventShape(idx){
            var shapeData = vm.markerData["customevent"][idx];
            if(shapeData["type"] == "CIRCLE"){
                return new daum.maps.Circle({
                    center : new daum.maps.LatLng(shapeData["circleLat"], shapeData["circleLng"]),
                    radius: shapeData["circleRadius"],
                    strokeWeight: 1,
                    strokeColor: '#004c80',
                    strokeOpacity: 0.8,
                    fillColor: '#00EEEE',
                    fillOpacity: 0.4
                });
            }
            else if(shapeData["type"] == "RECTANGLE"){
                return new daum.maps.Rectangle({
                    bounds : new daum.maps.LatLngBounds(
                        new daum.maps.LatLng(shapeData["rectangleSPointLat"], shapeData["rectangleSPointLng"]),
                        new daum.maps.LatLng(shapeData["rectangleEPointLat"], shapeData["rectangleEPointLng"])
                    ),
                    strokeWeight: 1,
                    strokeColor: '#004c80',
                    strokeOpacity: 0.8,
                    fillColor: '#00EEEE',
                    fillOpacity: 0.4
                });
            }
            else if(shapeData["type"] == "POLYGON"){
                var tempPath = [];
                for(var i=0; i<shapeData["polygonPath"].length; i++){
                    tempPath[i] = new daum.maps.LatLng(shapeData["polygonPath"][i]["lat"], shapeData["polygonPath"][i]["lng"]);
                }
                return new daum.maps.Polygon({
                    path: tempPath,
                    strokeWeight: 1,
                    strokeColor: '#004c80',
                    strokeOpacity: 0.8,
                    fillColor: '#00EEEE',
                    fillOpacity: 0.4 
                });
            }
            return ret;
        };

        createCategoryMarkersInJson();

        

//------------------------------------------------------------------------------

        //확대 축소 버튼 
        var zoomControl = new daum.maps.ZoomControl();
        map.addControl(zoomControl, daum.maps.ControlPosition.BOTTOMLEFT);

        // Zoom change Listener(zoom 범위 벗어났을대 재조정)
        //zoom_start listener 있음.
        daum.maps.event.addListener(map, 'zoom_changed', function() {        
            var MAX_MAP_LEVEL = 5;
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
            var dragendMoveLatLon = getLatlngInSkkuMap(dragendListenerLat, dragendListenerLng);
            
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
            var dragendMoveLatLon = getLatlngInSkkuMap(dragendListenerLat, dragendListenerLng);
            
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
            getLocation();
            alert(vm.userLat + " " + vm.userLng);
            if(vm.userLat != 0 && vm.userLng != 0){
                var dragendListenerLat = angular.copy(vm.userLat);
                var dragendListenerLng = angular.copy(vm.userLng);
                var dragendMoveLatLon = isLatlngInSkkuMap(dragendListenerLat, dragendListenerLng);
                if(false == dragendMoveLatLon){
                    alert('out of region');
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
                        map.panTo(dragendMoveLatLon);
                    }
                   
                }
                                
            }
        };

        //퀵패널 timeline에서 위치 클릭할 경우 그 위치로 지도가 이동합니다. 구역 중심 좌표가 나중에 생기면 그 좌표로 이동하면 될 것 같습니다.

        $scope.$watch(
            function watchEvent(scope){
                return(peerLocation.eventlocation);
            },
            function handleEvent(newValue, oldValue){
                for (var value in areas){
                    if (peerLocation.eventlocation == areas[value].name){
                        var moveEventLocation = areas[value].path[0];
                        map.panTo(moveEventLocation);
                    }
                }
            }, true);

        //Get User Location every 3 min. 1sec == 1000
        getLocation();
        $interval(getLocation, 180000); 
        function getLocation() {
            if (navigator.geolocation) { // GPS를 지원하는 경우
                navigator.geolocation.getCurrentPosition(function(position) {
                    //alert(position.coords.latitude + ' ' + position.coords.longitude);
                    //현재 user의 위치를 얻는다.
                    vm.userLng = position.coords.longitude;
                    vm.userLat = position.coords.latitude;
                }, function(error) {
                    console.error(error);
                }, {
                    enableHighAccuracy: true, //high Accuracy
                    maximumAge: 0,
                    timeout: 250000  //timeout Infinity시에 error 상태의 function이 절대 호출되지 않음.
                });
            } else {
                alert('GPS를 지원하지 않습니다');
            }
        }


        //여기부터 구역 오버레이
        var areas = [
        {
            name : '대운동장',
            path : [
                new daum.maps.LatLng(37.29633053586964, 126.97055773598099),
                new daum.maps.LatLng(37.29560965828155, 126.97036628596368),
                new daum.maps.LatLng(37.29422653626754, 126.97024840859957),
                new daum.maps.LatLng(37.29413222587683, 126.97146083846559),
                new daum.maps.LatLng(37.295821721003996, 126.97166884921043),
                new daum.maps.LatLng(37.29607414637932, 126.97223831181391)],
            center : new daum.maps.LatLng(37.29522913476928, 126.97103185113161)
        },
        {
            name : '축구장',
            path : [
                new daum.maps.LatLng(37.294237798526744, 126.97024558464248),
                new daum.maps.LatLng(37.292859189795344, 126.9701615434723),
                new daum.maps.LatLng(37.292760364156194, 126.97132884174466),
                new daum.maps.LatLng(37.29412099749306, 126.97160463810239)],
            center : new daum.maps.LatLng(37.293724357306424,126.97084916044457)
        },
        {
            name : '체육관',
            path : [
                new daum.maps.LatLng(37.29286144381089, 126.97016718152317),
                new daum.maps.LatLng(37.291996434805725, 126.9701167731897),
                new daum.maps.LatLng(37.29212056494911, 126.97107251523396),
                new daum.maps.LatLng(37.292767091823286, 126.97120478264264)],
            center : new daum.maps.LatLng(37.29256197141895,126.97065788570286)
        },
        {
            name : '체육관옆 주차장',
            path : [
                new daum.maps.LatLng(37.292767091823286, 126.97120478264264),
                new daum.maps.LatLng(37.29211831304373, 126.97107533553894),
                new daum.maps.LatLng(37.29184830033844, 126.97232444761218),
                new daum.maps.LatLng(37.29211862287488, 126.97237227912082),
                new daum.maps.LatLng(37.29219065833922, 126.97216925270226),
                new daum.maps.LatLng(37.29273127964678, 126.97216341462628),
                new daum.maps.LatLng(37.29283019867183, 126.97134573205959),
                new daum.maps.LatLng(37.292758111562016, 126.97132884259959)],
            center : new daum.maps.LatLng(37.29214803430012,126.97292487937636)
        },
        {
            name : '야구장',
            path : [
                new daum.maps.LatLng(37.291991931040336, 126.97012241384722),
                new daum.maps.LatLng(37.291023298250245, 126.97005513123322),
                new daum.maps.LatLng(37.29092422107707, 126.97020177920847),
                new daum.maps.LatLng(37.29078095819642, 126.97403621007072),
                new daum.maps.LatLng(37.29183972823175, 126.97426703969616),
                new daum.maps.LatLng(37.29197455478773, 126.97279524742041),
                new daum.maps.LatLng(37.29181686409148, 126.97275583215772),
                new daum.maps.LatLng(37.29184830099766, 126.97232726704469),
                new daum.maps.LatLng(37.29211831166563, 126.97106969665386)],
            center : new daum.maps.LatLng(37.29137289184392,126.97185377944646)
        },
        {
            name : '제2공학관',
            path : [
                new daum.maps.LatLng(37.29621241234462, 126.97617441649551),
                new daum.maps.LatLng(37.294617519232055, 126.97589296588225),
                new daum.maps.LatLng(37.294401599510714, 126.97756783444687),
                new daum.maps.LatLng(37.29561353836945, 126.97779867958785),
                new daum.maps.LatLng(37.29626206602032, 126.97665937160373),
                new daum.maps.LatLng(37.29626653772336, 126.9764901943625)],
            center : new daum.maps.LatLng(37.295142581391616,126.97693603394502)
        },
        {
            name : '제1공학관',
            path : [
                new daum.maps.LatLng(37.2946197712512, 126.97589014562742),
                new daum.maps.LatLng(37.293475411513505, 126.9756846878006),
                new daum.maps.LatLng(37.29327750842527, 126.97732287291998),
                new daum.maps.LatLng(37.294399345848184, 126.97756219606009)],
            center : new daum.maps.LatLng(37.29393513372225,126.97664317345912)
        },
        {
            name : '제1공학주차장',
            path : [
                new daum.maps.LatLng(37.29348665823904, 126.97560573835159),
                new daum.maps.LatLng(37.29233778908469, 126.97538337266668),
                new daum.maps.LatLng(37.29215121451527, 126.97734012764106),
                new daum.maps.LatLng(37.2928540218024, 126.97732863897212),
                new daum.maps.LatLng(37.29286301811545, 126.97725533003593),
                new daum.maps.LatLng(37.29327750950551, 126.97732851189186)],
            center : new daum.maps.LatLng(37.29288538130643,126.97642357921953)
        },
        {
            name : '잔디',
            path : [
                new daum.maps.LatLng(37.293429818811404, 126.97318099377772),
                new daum.maps.LatLng(37.293380383166046, 126.97372235339202),
                new daum.maps.LatLng(37.293612492248926, 126.97413955845153),
                new daum.maps.LatLng(37.29344385662842, 126.97559447420251),
                new daum.maps.LatLng(37.29234004167913, 126.97538337193266),
                new daum.maps.LatLng(37.29262561068856, 126.97304030616404)],
            center : new daum.maps.LatLng(37.2930224109238,126.97459369615953)
        },
        {
            name : '농구장',
            path : [
                new daum.maps.LatLng(37.29246146815878, 126.97437678670582),
                new daum.maps.LatLng(37.29188703333068, 126.97426984301876),
                new daum.maps.LatLng(37.29175884112093, 126.97523413153637),
                new daum.maps.LatLng(37.29234004167909, 126.97538337193264)],
            center : new daum.maps.LatLng(37.29204707917918,126.97478856550696)
        }
        ];

        for (var i = 0, len = areas.length; i < len; i++) {
            //displayArea(areas[i]);
        }

        function displayArea(area) {
        // 다각형을 생성합니다 
            var polygon = new daum.maps.Polygon({
                map: map, // 다각형을 표시할 지도 객체
                path: area.path,
                strokeWeight: 0,
                strokeColor: '#004c80',
                strokeOpacity: 0.8,
                fillColor: 'transparent',
                fillOpacity: 0.7 
            });

            // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다 
            daum.maps.event.addListener(polygon, 'mouseover', function(mouseEvent) {
                polygon.setOptions({fillColor: '#09f'});
                customOverlay.setContent('<div class="area">' + area.name + '</div>');
            
                customOverlay.setPosition(mouseEvent.latLng); 
                customOverlay.setMap(map);
            });

            // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다 
            daum.maps.event.addListener(polygon, 'mousemove', function(mouseEvent) {
                customOverlay.setPosition(mouseEvent.latLng); 
            });


            // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
            daum.maps.event.addListener(polygon, 'mouseout', function() {
                polygon.setOptions({fillColor: '#transparent'});
                customOverlay.setMap(null);
            }); 

            daum.maps.event.addListener(polygon, 'click', function(mouseEvent) {
                vm.clickName = area.name;
                vm.clickUrl = "http://fanatic1.iptime.org:8080/xwiki/bin/view/XWiki/"+area.name;
                vm.openMapDialog();
            });
        }
        var subAreaData = SubAreaData.data;
        for(var i=0; i<subAreaData.length; i++){
            displaySubArea(subAreaData[i]);
        }

        function displaySubArea(area) {
        // 다각형을 생성합니다 
            var polyPath = [];
            for(var i=0; i<area["path"].length; i++){
                polyPath[i] = new daum.maps.LatLng(area["path"][i]["lat"],area["path"][i]["lng"]);
            }

            var polygon = new daum.maps.Polygon({
                map: map, // 다각형을 표시할 지도 객체
                path: polyPath,
                strokeWeight: 0,
                strokeColor: '#004c80',
                strokeOpacity: 0.8,
                fillColor: 'transparent',
                fillOpacity: 0.7 
            });

            // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다 
            daum.maps.event.addListener(polygon, 'mouseover', function(mouseEvent) {
                polygon.setOptions({fillColor: '#09f'});
                customOverlay.setContent('<div class="area">' + area.name + '</div>');
            
                customOverlay.setPosition(mouseEvent.latLng); 
                customOverlay.setMap(map);
            });

            // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다 
            daum.maps.event.addListener(polygon, 'mousemove', function(mouseEvent) {
                customOverlay.setPosition(mouseEvent.latLng); 
            });


            // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
            daum.maps.event.addListener(polygon, 'mouseout', function() {
                polygon.setOptions({fillColor: '#transparent'});
                customOverlay.setMap(null);
            }); 

            daum.maps.event.addListener(polygon, 'click', function(mouseEvent) {
                vm.clickName = area["name"];
                vm.clickUrl = "http://fanatic1.iptime.org:8080/xwiki/bin/view/XWiki/"+area.name;;
                vm.openMapDialog();
            });
        }
    }
    // 여기까지 구역 오버레이 & MapController

    //boundary check.
    function isMarkerInShape(markerLat, markerLng, drawingObj, shapeType){ //drawingObj = curDrawingObj[shapeType][0]
        if(shapeType == "circle"){
            var X = (drawingObj["center"]["x"]-markerLng);
            var Y = (drawingObj["center"]["y"]-markerLat);
            if( (X*X + Y*Y) > drawingObj["radius"]*drawingObj["radius"]){
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

    //주어진 좌표를 맵에서 벗어나지 않도록 재조정하여 다시 return함.
    function getLatlngInSkkuMap(lat, lng){
        // 범위 최대 최소 좌표
        var MAX_LAT = 37.3, MIN_LAT = 37.29, MAX_LNG = 126.979, MIN_LNG = 126.965;

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

})();
