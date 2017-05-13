(function ()
{
    'use strict';

    angular
        .module('app.map')
        .controller('MapController', MapController);

    /** @ngInject */
    function MapController()
    {
        var vm = this;

        vm.userLat = 0;
        vm.userLng = 0;
        vm.curMapLevel = 3;     //현재 지도의 zoom level

        var container = document.getElementById('map');
        var options = {
            center: new daum.maps.LatLng(37.2939170, 126.9753990),
            level: 3
        };

        var map = new daum.maps.Map(container, options);


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
