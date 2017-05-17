(function ()
{
    'use strict';

    angular
        .module('app.map')
        .controller('MapController', MapController);

    /** @ngInject */
    function MapController($mdDialog, MarkerData, $scope, $interval)
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

        var map = new daum.maps.Map(container, options),
        customOverlay = new daum.maps.CustomOverlay({}),
        infowindow = new daum.maps.InfoWindow({removable: true});;



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

        //구역 다이얼로그 
        vm.showDetailed = function(ev) {
            $mdDialog.show({
              controller: DetailedDialogController,
              templateUrl: 'app/main/map/dialog2.tmpl.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true,
              fullscreen: false // Only for -xs, -sm breakpoints.
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

        //카테고리가 정해져있으면 printedCategoryMarkers에 해당 카테고리 마커들을 저장하고 출력한다.
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
      SPRITE_MARKER_URL = 'https://imageshack.com/i/pmv6VYYJp', // 스프라이트 마커 임시 이미지 URL
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



        function DetailedDialogController($scope, $mdDialog) {
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

        //Get User Location every 3 min. 1sec == 1000
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
                  enableHighAccuracy: false,
                  maximumAge: 0,
                  timeout: Infinity
              });
            } else {
                alert('GPS를 지원하지 않습니다');
            }
        }


       //여기부터 구역 오버레이
        var areas = [
        {
          name : '신관 A동',
          path : [
            new daum.maps.LatLng(37.296704968860624, 126.97265256324391),
            new daum.maps.LatLng(37.29690979382814, 126.97196450141166),
            new daum.maps.LatLng(37.29682191460552, 126.97184611005511),
            new daum.maps.LatLng(37.29673406617434, 126.97185742125625),
            new daum.maps.LatLng(37.2965785549857, 126.97151348685938),
            new daum.maps.LatLng(37.29620235704303, 126.97145159762604),
            new daum.maps.LatLng(37.29602692537724, 126.97259641693125),
            new daum.maps.LatLng(37.2962250951866, 126.97234540099207),
            new daum.maps.LatLng(37.296360251416225, 126.97234817111507),
            new daum.maps.LatLng(37.29638054907893, 126.97245248895516),
            new daum.maps.LatLng(37.296373805066956, 126.97251170304891)]
        },
        {
          name : '신관 왼쪽',
          path : [
            new daum.maps.LatLng(37.29658756467791, 126.97151066385224),
            new daum.maps.LatLng(37.29661889154948, 126.9706534903612),
            new daum.maps.LatLng(37.29633053586964, 126.97055773598099),
            new daum.maps.LatLng(37.29619109339872, 126.97144878228792),
            new daum.maps.LatLng(37.2965785549857, 126.97151348685938)]
        },
        {
          name : '대운동장',
          path : [
            new daum.maps.LatLng(37.29633053586964, 126.97055773598099),
            new daum.maps.LatLng(37.29560965828155, 126.97036628596368),
            new daum.maps.LatLng(37.29422653626754, 126.97024840859957),
            new daum.maps.LatLng(37.29413222587683, 126.97146083846559),
            new daum.maps.LatLng(37.295821721003996, 126.97166884921043),
            new daum.maps.LatLng(37.29607414637932, 126.97223831181391)]
        },
        {
          name : '축구장',
          path : [
            new daum.maps.LatLng(37.294237798526744, 126.97024558464248),
            new daum.maps.LatLng(37.292859189795344, 126.9701615434723),
            new daum.maps.LatLng(37.292760364156194, 126.97132884174466),
            new daum.maps.LatLng(37.29412099749306, 126.97160463810239)]
        },
        {
          name : '학군단+우체국',
          path : [
            new daum.maps.LatLng(37.2938191370707, 126.9715511809384),
            new daum.maps.LatLng(37.29372469677456, 126.97226173119748),
            new daum.maps.LatLng(37.29350859537792, 126.97289901634265),
            new daum.maps.LatLng(37.29348162974963, 126.97318661437316),
            new daum.maps.LatLng(37.29523872261613, 126.97349614225901),
            new daum.maps.LatLng(37.29574771449301, 126.97307866610024),
            new daum.maps.LatLng(37.29568913166175, 126.97301101715107),
            new daum.maps.LatLng(37.29602241953844, 126.97259359897726),
            new daum.maps.LatLng(37.29607189643125, 126.97224959100222),
            new daum.maps.LatLng(37.295828478783, 126.97166884667607),
            new daum.maps.LatLng(37.29413898501734, 126.9714664749487),
            new daum.maps.LatLng(37.29411649298212, 126.97160745931284)]
        },
        {
          name : '체육관',
          path : [
            new daum.maps.LatLng(37.29286144381089, 126.97016718152317),
            new daum.maps.LatLng(37.291996434805725, 126.9701167731897),
            new daum.maps.LatLng(37.29212056494911, 126.97107251523396),
            new daum.maps.LatLng(37.292767091823286, 126.97120478264264)]
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
            new daum.maps.LatLng(37.292758111562016, 126.97132884259959)]
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
            new daum.maps.LatLng(37.29211831166563, 126.97106969665386)]
        },
        {
          name : '수성관',
          path : [
            new daum.maps.LatLng(37.29382138830898, 126.97154554107796),
            new daum.maps.LatLng(37.29283019798922, 126.97134291259047),
            new daum.maps.LatLng(37.29262335680978, 126.97303466804495),
            new daum.maps.LatLng(37.29348162974979, 126.97318661437308),
            new daum.maps.LatLng(37.29350633890937, 126.97288210018438),
            new daum.maps.LatLng(37.29372244153725, 126.97225045401483)]
        },
        {
          name : '의학건물3',
          path : [
            new daum.maps.LatLng(37.292722270595995, 126.9721690568763),
            new daum.maps.LatLng(37.29219066099043, 126.97218053048334),
            new daum.maps.LatLng(37.29212312937981, 126.9723779163589),
            new daum.maps.LatLng(37.29184379580857, 126.97232726869477),
            new daum.maps.LatLng(37.29181686668676, 126.9727671098831),
            new daum.maps.LatLng(37.291981311923124, 126.97279242554966),
            new daum.maps.LatLng(37.29183972700573, 126.97426140083167),
            new daum.maps.LatLng(37.29246597395776, 126.97437960463353)]
        },
        {
          name : '기숙사 의관',
          path : [
            new daum.maps.LatLng(37.29744868301134, 126.97425103088113),
            new daum.maps.LatLng(37.29703891053236, 126.97518446692281),
            new daum.maps.LatLng(37.29649375701809, 126.97506058333734),
            new daum.maps.LatLng(37.29635162110362, 126.97402583675967)]
        },
        {
          name : '산학협력센터',
          path : [
            new daum.maps.LatLng(37.296493759394124, 126.97507186176118),
            new daum.maps.LatLng(37.29594411721011, 126.97502692976583),
            new daum.maps.LatLng(37.29577732564257, 126.97455893472468),
            new daum.maps.LatLng(37.29526382693231, 126.97499331992931),
            new daum.maps.LatLng(37.295435110277765, 126.97540491995802),
            new daum.maps.LatLng(37.2953766701269, 126.97602524316154),
            new daum.maps.LatLng(37.296210160319234, 126.97617723680133),
            new daum.maps.LatLng(37.296462302067695, 126.97544969920628)]
        },
        {
          name : '기숙사 예관',
          path : [
            new daum.maps.LatLng(37.297041164307124, 126.97519010543559),
            new daum.maps.LatLng(37.296390415187034, 126.97641402654843),
            new daum.maps.LatLng(37.296264284570334, 126.97648737546612),
            new daum.maps.LatLng(37.296210161454134, 126.9761828759921),
            new daum.maps.LatLng(37.296462302067695, 126.97544969920628),
            new daum.maps.LatLng(37.29650051598474, 126.97506622031872)]
        },
        {
          name : '제2공학관',
          path : [
            new daum.maps.LatLng(37.29621241234462, 126.97617441649551),
            new daum.maps.LatLng(37.294617519232055, 126.97589296588225),
            new daum.maps.LatLng(37.294401599510714, 126.97756783444687),
            new daum.maps.LatLng(37.29561353836945, 126.97779867958785),
            new daum.maps.LatLng(37.29626206602032, 126.97665937160373),
            new daum.maps.LatLng(37.29626653772336, 126.9764901943625)]
        },
        {
          name : '제1공학관',
          path : [
            new daum.maps.LatLng(37.2946197712512, 126.97589014562742),
            new daum.maps.LatLng(37.293475411513505, 126.9756846878006),
            new daum.maps.LatLng(37.29327750842527, 126.97732287291998),
            new daum.maps.LatLng(37.294399345848184, 126.97756219606009)]
        },
        {
          name : '제1공학주차장',
          path : [
            new daum.maps.LatLng(37.29348665823904, 126.97560573835159),
            new daum.maps.LatLng(37.29233778908469, 126.97538337266668),
            new daum.maps.LatLng(37.29215121451527, 126.97734012764106),
            new daum.maps.LatLng(37.2928540218024, 126.97732863897212),
            new daum.maps.LatLng(37.29286301811545, 126.97725533003593),
            new daum.maps.LatLng(37.29327750950551, 126.97732851189186)]
        },
        {
          name : '잔디',
          path : [
            new daum.maps.LatLng(37.293429818811404, 126.97318099377772),
            new daum.maps.LatLng(37.293380383166046, 126.97372235339202),
            new daum.maps.LatLng(37.293612492248926, 126.97413955845153),
            new daum.maps.LatLng(37.29344385662842, 126.97559447420251),
            new daum.maps.LatLng(37.29234004167913, 126.97538337193266),
            new daum.maps.LatLng(37.29262561068856, 126.97304030616404)]
        },
        {
          name : '정문+주차장',
          path : [
            new daum.maps.LatLng(37.29078546647779, 126.97405030548701),
            new daum.maps.LatLng(37.29070014509219, 126.97534725415045),
            new daum.maps.LatLng(37.29063712617037, 126.97560665836819),
            new daum.maps.LatLng(37.29101564738801, 126.9760238076147),
            new daum.maps.LatLng(37.29141662181959, 126.9760857075401),
            new daum.maps.LatLng(37.29154258731094, 126.97521164705024),
            new daum.maps.LatLng(37.29175884230062, 126.97523977039477),
            new daum.maps.LatLng(37.29188478073619, 126.97426984378593)]
        },
        {
          name : '농구장',
          path : [
            new daum.maps.LatLng(37.29246146815878, 126.97437678670582),
            new daum.maps.LatLng(37.29188703333068, 126.97426984301876),
            new daum.maps.LatLng(37.29175884112093, 126.97523413153637),
            new daum.maps.LatLng(37.29234004167909, 126.97538337193264)]
        },
        {
          name : 'N센터+약학건물',
          path : [
            new daum.maps.LatLng(37.291015648530085, 126.97602944641773),
            new daum.maps.LatLng(37.291062972966216, 126.97612811052508),
            new daum.maps.LatLng(37.29109912853108, 126.97670043827863),
            new daum.maps.LatLng(37.29184026263224, 126.97685527851512),
            new daum.maps.LatLng(37.291815522518405, 126.97705264630208),
            new daum.maps.LatLng(37.292171446104916, 126.97712302432127),
            new daum.maps.LatLng(37.29233778849833, 126.97538055321574),
            new daum.maps.LatLng(37.29176559949466, 126.97523694875066),
            new daum.maps.LatLng(37.291540335306664, 126.97521446721032),
            new daum.maps.LatLng(37.29141887441435, 126.9760857068271)]
        },
        {
          name : '생명공학실습동',
          path : [
            new daum.maps.LatLng(37.294099739108546, 126.97750025567385),
            new daum.maps.LatLng(37.294027763003506, 126.97806981895974),
            new daum.maps.LatLng(37.293870127146015, 126.97831798144205),
            new daum.maps.LatLng(37.293771130030905, 126.97896649589669),
            new daum.maps.LatLng(37.29523971540957, 126.97837961867245),
            new daum.maps.LatLng(37.29560903318305, 126.97779868091187)]
        },
        {
          name : '공학실습동',
          path : [
            new daum.maps.LatLng(37.29214445727149, 126.97734294911152),
            new daum.maps.LatLng(37.291987063332265, 126.9788993260616),
            new daum.maps.LatLng(37.29241960147523, 126.97912476158966),
            new daum.maps.LatLng(37.292928692765805, 126.97915281565732),
            new daum.maps.LatLng(37.29376662384084, 126.9789608581425),
            new daum.maps.LatLng(37.29387463026725, 126.9783067021161),
            new daum.maps.LatLng(37.29402326407988, 126.97810365443301),
            new daum.maps.LatLng(37.29410424322399, 126.97749461529854),
            new daum.maps.LatLng(37.29286977427243, 126.97724686958937),
            new daum.maps.LatLng(37.29285627493668, 126.97733145776638)]
        },
        {
          name : '반도체관+화학관',
          path : [
            new daum.maps.LatLng(37.29217144719466, 126.97712866321062),
            new daum.maps.LatLng(37.29182002716112, 126.97704982550225),
            new daum.maps.LatLng(37.29184251357268, 126.97684681952796),
            new daum.maps.LatLng(37.291094625560675, 126.97671171728578),
            new daum.maps.LatLng(37.29109920120449, 126.97707259969202),
            new daum.maps.LatLng(37.29113976208931, 126.9771458919486),
            new daum.maps.LatLng(37.29129761240153, 126.97803677846522),
            new daum.maps.LatLng(37.29126612702063, 126.97831308990075),
            new daum.maps.LatLng(37.29121210073938, 126.97851046404055),
            new daum.maps.LatLng(37.291996075720604, 126.97891060129781)]
        },
        {
          name : '학생회관',
          path : [
            new daum.maps.LatLng(37.29524322906529, 126.97350177979696),
            new daum.maps.LatLng(37.29444594946978, 126.97412799503698),
            new daum.maps.LatLng(37.293508833365564, 126.97395914627134),
            new daum.maps.LatLng(37.29338714470254, 126.97373926798132),
            new daum.maps.LatLng(37.29341855711919, 126.9731866367581)]
        },
        {
          name : '삼성학술정보관',
          path : [
            new daum.maps.LatLng(37.29438287438327, 126.97411673852834),
            new daum.maps.LatLng(37.2941669820941, 126.9758028850296),
            new daum.maps.LatLng(37.29348217045368, 126.97569032461274),
            new daum.maps.LatLng(37.293482154213216, 126.97561137879333),
            new daum.maps.LatLng(37.293446108059555, 126.97558883449042),
            new daum.maps.LatLng(37.293603484336856, 126.97415083952792),
            new daum.maps.LatLng(37.29351333731268, 126.97395350572909)]
        },
        {
          name : '학부대학',
          path : [
            new daum.maps.LatLng(37.296308752115365, 126.9737100563868),
            new daum.maps.LatLng(37.296243436934056, 126.97375519266608),
            new daum.maps.LatLng(37.29574771577553, 126.97308430525632),
            new daum.maps.LatLng(37.294432436372965, 126.97413927778145),
            new daum.maps.LatLng(37.294382876849056, 126.97412801663683),
            new daum.maps.LatLng(37.29417599362165, 126.97580852118259),
            new daum.maps.LatLng(37.29538793252204, 126.97602242002246),
            new daum.maps.LatLng(37.29543736579969, 126.97541901705723),
            new daum.maps.LatLng(37.29527058173278, 126.97497921989097),
            new daum.maps.LatLng(37.295784085239696, 126.97456739118716),
            new daum.maps.LatLng(37.29595087677365, 126.97503538628888),
            new daum.maps.LatLng(37.29649826517353, 126.9750746798805)]
        },
        {
          name : '신관 B동',
          path : [
            new daum.maps.LatLng(37.29670046302381, 126.97264974526139),
            new daum.maps.LatLng(37.296369300536256, 126.97251452428941),
            new daum.maps.LatLng(37.29638280101547, 126.97244966853198),
            new daum.maps.LatLng(37.29635799882358, 126.97234817193966),
            new daum.maps.LatLng(37.29622284259379, 126.9723454018167),
            new daum.maps.LatLng(37.295686879711646, 126.97301383753157),
            new daum.maps.LatLng(37.29624569140227, 126.9737636506734),
            new daum.maps.LatLng(37.29630650014887, 126.9737128767697),
            new daum.maps.LatLng(37.29682227333353, 126.97339690003034),
            new daum.maps.LatLng(37.29661942805414, 126.97290353957344)]
        },
        {
          name : '기숙사인관',
          path : [
            new daum.maps.LatLng(37.29744642980555, 126.97424821200755),
            new daum.maps.LatLng(37.29744185300398, 126.973921135152),
            new daum.maps.LatLng(37.29706565512484, 126.97385359396854),
            new daum.maps.LatLng(37.29682903111131, 126.97339689765029),
            new daum.maps.LatLng(37.29630875211548, 126.97371005638686),
            new daum.maps.LatLng(37.29635162172224, 126.97402865636019)]
        }

        ];  

        for (var i = 0, len = areas.length; i < len; i++) {
          displayArea(areas[i]);
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
          vm.showDetailed();
        });
      }

    }
// 여기까지 구역 오버레이 & MapController


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
