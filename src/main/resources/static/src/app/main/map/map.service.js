(function ()
{
    'use strict';

    angular
        .module('app.core')
        .service('mapLocation', mapLocation);

    /** @ngInject */
    function mapLocation($interval)
    {
        var service = this;
        //map에 진입시 항상 이 좌표, 줌, 상태로 이동합니다.
        //지역 이동전 다음 변수를 바꾸세요. lastCategoryStatus를 "regions"로 교체시 '지역'상태로 이동합니다.
        //줌을 1로 만들면 확대된 상태의 지도가 나타납니다.
        service.lastLat = 37.2939170;
        service.lastLng = 126.9753990;  //app 첫 진입시 사용자 위치가 아닌 성대 중앙으로 이동
        service.lastZoomLevel = 3;
        service.lastCategoryStatus = "none";

        service.searchResult = {
            lat : 0,
            lng : 0,
            type : '',
            id : 0,
            l_id: 0,
            cnt : 0             //watch를 위한 cnt. 중복 타깃 클릭시 무반응 방지
        }
        


        //사용자 위치 정보로 interval마다 위치정보를 갱신합니다. 초기 정보는 바꿔도 상관 없습니다.
        service.userLastLat = 0.0;
        service.userLastLng = 0.0;
        
        //peerLocation에 보내는 정보
        service.userCord = {
            lat : service.userLastLat,
            lng : service.userLastLng,
            cnt : 0 // 사용자가 자기위치 버튼을 누른 경우 cnt 증가
        };

	    //Get User Location every 1 min. 1sec == 1000
        
        service.getLocation = function() {
            if (navigator.geolocation) { // GPS를 지원하는 경우
                navigator.geolocation.getCurrentPosition(function(position) {
                    //alert(position.coords.latitude + ' ' + position.coords.longitude);
                    //현재 user의 위치를 얻는다.
                    service.userLastLng = position.coords.longitude;
                    service.userLastLat = position.coords.latitude;
                    service.userCord.lat = service.userLastLat;
                    service.userCord.lng = service.userLastLng;
                    //service.userCord.cnt++;
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

        service.getLocation();
        $interval(service.getLocation, 60000);  //다음 시간마다 반복.
    }

})();