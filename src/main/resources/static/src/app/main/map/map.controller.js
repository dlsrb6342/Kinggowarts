(function ()
{
    'use strict';

    angular
        .module('app.map')
        .controller('MapController', MapController);

    /** @ngInject */
    function MapController($mdDialog, MarkerData, $scope)
    {
        var vm = this;
        vm.markerData = MarkerData.data;
        
        
        vm.userLat = 0;
        vm.userLng = 0;
        vm.curMapLevel = 3;     //현재 지도의 zoom level
        //category status type : {bank, toilet, print, busstop, vendingmachine}, {insideRestaurant, outsideRestaurant}, {standard, engineer, comm, soft}, group, region
        vm.categoryStatus = "none"; 
        var container = document.getElementById('map');
        var options = {
            center: new daum.maps.LatLng(37.2939170, 126.9753990),
            level: 3
        };

        var map = new daum.maps.Map(container, options);



//----------------------------------카테고리 선택 메뉴 -------------------------------
        vm.showAdvanced = function(ev) {
            $mdDialog.show({
              controller: CategoryDialogController,
              templateUrl: 'app/main/map/dialog1.tmpl.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true,
      fullscreen: false // Only for -xs, -sm breakpoints.
            })
            .then(function(answer) {
                //category status type : {bank, toilet, print, busstop, vendingmachine}, {insideRestaurant, outsideRestaurant}, {standard, engineer, comm, soft}, group, region 
              vm.categoryStatus = answer;
              alert('vm.categoryStatus = '+ vm.categoryStatus);
          }, function() {
              vm.categoryStatus = "none";
              alert('vm.categoryStatus = '+ vm.categoryStatus);
          });
        };

        function CategoryDialogController($scope, $mdDialog) {
            //카테고리 분류를 위한 카테고리 레벨. none, Restaurant, Major, Group이 존재하며 region은 바로 적용?
            $scope.categoryLevel = "none";
            //Major category ng-bind
            $scope.major = "none";
            //set category level
            $scope.categoryLevelChangefunc = function(strLevel){
                $scope.categoryLevel = strLevel;
            };
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
    //categoryStatus가 바뀔 때 맵 위에 marker를 갱신하는 watch
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

        if(vm.categoryStatus != "none"){
          for(var i=0; i<categoryMarkers[vm.categoryStatus].length; i++){
              categoryMarkers[vm.categoryStatus][i].setMap(map);
              printedCategoryMarkers[i] =  categoryMarkers[vm.categoryStatus][i];
          }
        }
      }, true);
   
    //Marker Image Process------------------------------------------
    var categoryTypes = ["bank", "toilet", "busstop", "print", "vendingmachine", "insideRestaurant"];
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
      SPRITE_MARKER_URL = 'https://imageshack.com/i/pmv6VYYJp', // 스프라이트 마커 이미지 URL
      SPRITE_WIDTH = 126, // 스프라이트 이미지 너비
      SPRITE_HEIGHT = 307, // 스프라이트 이미지 높이. 이미지 변경시 너비와 높이 변경 필수.
      SPRITE_GAP = 10; // 스프라이트 이미지에서 마커간 간격

    var markerSize = new daum.maps.Size(MARKER_WIDTH, MARKER_HEIGHT), // 기본, 클릭 마커의 크기
      markerOffset = new daum.maps.Point(OFFSET_X, OFFSET_Y), // 기본, 클릭 마커의 기준좌표
      overMarkerSize = new daum.maps.Size(OVER_MARKER_WIDTH, OVER_MARKER_HEIGHT), // 오버 마커의 크기
      overMarkerOffset = new daum.maps.Point(OVER_OFFSET_X, OVER_OFFSET_Y), // 오버 마커의 기준 좌표
      spriteImageSize = new daum.maps.Size(SPRITE_WIDTH, SPRITE_HEIGHT); // 스프라이트 이미지의 크기

    // 마커 이미지를 생성합니다.
    for (var i = 0; i < categoryTypes.length; i++) {
        var gapX = (MARKER_WIDTH + SPRITE_GAP), // 스프라이트 이미지에서 마커로 사용할 이미지 X좌표 간격 값
          originY = (MARKER_HEIGHT + SPRITE_GAP) * i, // 스프라이트 이미지에서 기본, 클릭 마커로 사용할 Y좌표 값
          overOriginY = (OVER_MARKER_HEIGHT + SPRITE_GAP) * i, // 스프라이트 이미지에서 오버 마커로 사용할 Y좌표 값
          normalOrigin = new daum.maps.Point(0, originY), // 스프라이트 이미지에서 기본 마커로 사용할 영역의 좌상단 좌표
          clickOrigin = new daum.maps.Point(gapX, originY), // 스프라이트 이미지에서 마우스오버 마커로 사용할 영역의 좌상단 좌표
          overOrigin = new daum.maps.Point(gapX * 2, overOriginY); // 스프라이트 이미지에서 클릭 마커로 사용할 영역의 좌상단 좌표
        // 마커를 생성하고 지도위에 표시합니다
        addMarkerImage(i, normalOrigin, overOrigin, clickOrigin);
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
      //var markerImage = new daum.maps.MarkerImage(
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
            image: normalImage[categoryTypes[typeI]]
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
       });

          // 마커에 mouseout 이벤트를 등록합니다
          daum.maps.event.addListener(marker, 'mouseout', function () {
          // 클릭된 마커가 없거나 mouseout된 마커가 클릭된 마커가 아니면
          // 마커의 이미지를 기본 이미지로 변경합니다
          if (!selectedMarker || selectedMarker !== marker) {
            //marker.setImage(normalImage[categoryTypes[i]]);
            marker.setImage(normalImage[categoryTypes[typeI]]);
          }
        });

          // 마커에 click 이벤트를 등록합니다
          daum.maps.event.addListener(marker, 'click', function () {

          // 클릭된 마커가 없거나 click 마커가 클릭된 마커가 아니면
          // 마커의 이미지를 클릭 이미지로 변경합니다
          if (!selectedMarker || selectedMarker !== marker) {

            // 클릭된 마커 객체가 null이 아니면
            // 클릭된 마커의 이미지를 마커에 등록해놓았던 기본 이미지로 변경하고
            //!!selectedMarker && selectedMarker.setImage(selectedMarker.normalImage[categoryTypes[i]]);
            !!selectedMarker && selectedMarker.setImage(selectedMarker.normalImage);

            // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경합니다
            //marker.setImage(clickImage[categoryTypes[i]]);
            marker.setImage(clickImage[categoryTypes[typeI]]);
          }

          // 클릭된 마커를 현재 클릭된 마커 객체로 설정합니다
          selectedMarker = marker;
          });


          //생성한 마커를 categoryMarkers에 저장.
          categoryMarkers[categoryTypes[typeI]][typeIdx] = marker;
      };

    //marker.json 정보에서 categoryMarkers obj 생성.
     for(var i = 0; i<categoryTypes.length; i++){
        //set empty array in categoryMarkers{"categoryType" : [], "categoryType2" : [] ...}
        categoryMarkers[categoryTypes[i]] = [];
        //카테고리 타입별 위치정보 개수 만큼 loop
        for(var idx = 0; idx< vm.markerData[categoryTypes[i]].length; idx++){
            createCategoryMarkers(i, idx);
        }
    }




//------------------------------------------------------------------------------

        //확대 축소 버튼 
        var zoomControl = new daum.maps.ZoomControl();
        map.addControl(zoomControl, daum.maps.ControlPosition.BOTTOMLEFT);

        
        //get user location
        getLocation();

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


        
        //사용자의 위치로 이동한다. 맵의 범위를 벗어나는 경우 표시하지 않는다.(alert 처리해놓음)
        vm.moveToUserLocation = function(){
            if(vm.userLat != 0 && vm.userLng != 0){
                var dragendListenerLat = angular.copy(vm.userLat);
                var dragendListenerLng = angular.copy(vm.userLng);
                var dragendMoveLatLon = isLatlngInSkkuMap(dragendListenerLat, dragendListenerLng);
                if(false == dragendMoveLatLon){
                    alert('out of region');
                }
                else{
                    map.panTo(dragendMoveLatLon);
                }
                                
            }
        };

        //Get User Location
        function getLocation() {
            if (navigator.geolocation) { // GPS를 지원하는 경우
                navigator.geolocation.getCurrentPosition(function(position) {
                  alert(position.coords.latitude + ' ' + position.coords.longitude);
                  //현재 user의 위치를 얻는다.
                  vm.userLng = position.coords.longitude;
                  vm.userLat = position.coords.latitude;
              }, function(error) {
                  console.error(error);
              }, {
                  enableHighAccuracy: false,
                  maximumAge: 0,
                  timeout: Infinity
              });
            } else {
                alert('GPS를 지원하지 않습니다');
            }
        }
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
