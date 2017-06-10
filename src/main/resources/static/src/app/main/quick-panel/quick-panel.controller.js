(function ()
{
    'use strict';

    angular
        .module('app.main.quick-panel')
        .controller('QuickPanelController', QuickPanelController);

    /** @ngInject */
    function QuickPanelController(
        // 데이터
        TimelineData, 
        PeerData, 
        RequestData, 
        RecentwikiData, 
        NoticeCategoryData,

        // 모듈
        $http,     
        $httpParamSerializerJQLike, 
        $rootScope, 
        $scope,
        $state, 
        $sessionStorage, 

        // 서비스
        mapLocation, 
        peerLocation
        )
    {
        var vm = this;

        vm.peer = PeerData.data;
        vm.request = RequestData.data;
        vm.recentwiki = RecentwikiData.data.searchResults;
        vm.timelineList = TimelineData;
        vm.notice_category = NoticeCategoryData.data;

        vm.peerlist = {
            checklist : [],
            currentlocation : "active",
            peerrange : {
                active : '온라인',
                n_active : '오프라인'
            },
            peer : {
                active : [],
                n_active : [],
            }
        };

        vm.prequest = {
            currentrequest : "recv",
            range : {
                send : "보내기",
                recv : "받기"
            }
        };

        vm.selected = {
            active : [],
            n_active : []
        };

        vm.wikihistory = {
            Name : [],
            Link : []
        };

        vm.searchresult;

        vm.defaultimg = "./assets/images/avatars/profile.jpg";

        $scope.$watch(
            function watchEvent(scope){
                return(mapLocation.userCord);
            },
            function handleEvent(newValue, oldValue){
                if(mapLocation.userCord.lat != 0 && mapLocation.userCord.lng != 0){
                    var userloc = {
                        lng : mapLocation.userCord.lng,
                        lat : mapLocation.userCord.lat
                    };

                    $http({
                        method : 'PATCH',
                        url : './api/member/coordinate',
                        data : JSON.stringify(userloc),
                        headers: {
                            'x-auth-token' : $sessionStorage.get('AuthToken')
                        }
                    }).then (function (response){
                        vm.peer = response.data;
                        vm.peerinit();
                        var showpeer = document.getElementById("showpeerlistcontainer");
                        showpeer.focus();
                    });
                }
            }, true);


        vm.gotoTimelineNotice = function (timelineId, timelineCategory) {
            //해당 글로 이동
            if(timelineId != 0 && timelineId != undefined){
                $state.go('app.main.notice.list.item', { category : timelineCategory, id : timelineId});
            }
        };
        
        vm.gotoTimelineLocation = function (location) {
            console.log(location);
            //구역 ID로 이동
            if(location.id != 0 && location.id != undefined){
                mapLocation.lastLat = location.center.lat;
                mapLocation.lastLng = location.center.lng;
                mapLocation.searchResult.lat = location.center.lat;
                mapLocation.searchResult.lng = location.center.lng;
                mapLocation.searchResult.type = 'map';
                mapLocation.searchResult.id = location.id;
                mapLocation.searchResult.cnt++;
                $state.go('app.main.map');
            }
            $state.go('app.main.map');
        };

        function init()
        {
            vm.peerinit();
            vm.getWikiLink();
        };

        
        //최근 wiki 수정항목의 주소를 가져오는 함수
        vm.getWikiLink = function () 
        {
            
            for (var i=0; i<vm.recentwiki.length; i++){
                var obj = {};
                obj.Title = vm.recentwiki[i].title;
                obj.Link = '../xwiki/bin/view/XWiki/' + obj.Title;
                vm.wikihistory.Link.push(obj);
            }
        };

        //peer정보를 처리하는 함수
        vm.peerinit = function(){

            vm.peerlist.peer.active= [];
            vm.peerlist.peer.n_active = [];
            vm.peerlist.checklist = [];
            for(var value in vm.peer){
                
                vm.peerlist.checklist.push(vm.peer[value].memberSeq);
                if(vm.peer[value].profileImgPath == "") vm.peer[value].profileImgPath = vm.defaultimg;
                else vm.peer[value].profileImgPath = "./profileimg/"+ vm.peer[value].profileImgPath;

                if(vm.peer[value].lat == -1 && vm.peer[value].lng == -1){
                    vm.peerlist.peer.n_active.push(vm.peer[value]);
                    vm.peerlist.peer.n_active[vm.peerlist.peer.n_active.length-1].weight = [vm.peerlist.peer.n_active.length-1];
                }
                else{
                    vm.peerlist.peer.active.push(vm.peer[value]);
                    vm.peerlist.peer.active[vm.peerlist.peer.active.length-1].weight = [vm.peerlist.peer.active.length-1];
                }
            }
            peerLocation.peer = vm.peerlist.peer;     
        }

        //최근 위키 수정 항목을 클릭했을 때 그 위키 페이지로 이동하는 함수
        vm.wikigo = function (wikilink) 
        {
            //wiki state일 때는 reload, 아닐때는 wikistate로

            $rootScope.wikipath=wikilink;

            if($state.includes('app.main.wiki') == true)
            {
                $state.reload();
            }
            else
            {
                $state.go('app.main.wiki');
            }
            
        };
        
        //아래는 checklist 구현하는 함수들
        vm.toggle = function (peer, list) {
            var idx = list.indexOf(peer.weight);
            if (idx > -1) {
              list.splice(idx, 1);
              peer.checked = false;
            }
            else {
              list.push(peer.weight);
              peer.checked = true;
            }
            peerLocation.peer = vm.peerlist.peer;
        };

        vm.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };

        vm.isIndeterminate = function() {
            return (vm.selected[vm.peerlist.currentlocation].length !== 0 &&
                vm.selected[vm.peerlist.currentlocation].length !== vm.peerlist.peer[vm.peerlist.currentlocation].length+1);
        };

        vm.isChecked = function() {
            return vm.selected[vm.peerlist.currentlocation].length === vm.peerlist.peer[vm.peerlist.currentlocation].length+1;
          };
          
        vm.toggleAll = function() {
            for (var value in vm.peerlist.peer[vm.peerlist.currentlocation]){
                vm.toggle(vm.peerlist.peer[vm.peerlist.currentlocation][value],vm.selected[vm.peerlist.currentlocation]);
            }
        };
         
        vm.untoggleAll = function() {
            vm.selected[vm.peerlist.currentlocation] = [];
            for (var value in vm.peerlist.peer[vm.peerlist.currentlocation]){
                vm.peerlist.peer[vm.peerlist.currentlocation][value].checked = false;
            }
            peerLocation.peer = vm.peer;
        };

        //피어를 삭제하는 함수
        vm.deletepeer = function(delpeer) {

            var con = confirm("정말로 삭제하시겠습니까?");

            if (con == true) {
                $http({
                    method : 'DELETE',
                    url : './api/member/peer?toSeq='+delpeer.memberSeq,
                    headers: {'x-auth-token' : $sessionStorage.get('AuthToken')}
                }).then(function (response){
                    if(delpeer.checked == true){
                        vm.toggle(delpeer,vm.selected[vm.peerlist.currentlocation]);
                    }
                    vm.peerlist.checklist.splice(delpeer.memberSeq);
                    vm.peerlist.peer[vm.peerlist.currentlocation].splice(vm.peerlist.peer[vm.peerlist.currentlocation].indexOf(delpeer),1);
                    focusChecklistInput();
                });
            }
            
        }

        //유저들에 대한 정보를 가져와서 보여주는 함수
        vm.finduser = function(){

            var showsearch = document.getElementById("showsearchresult");

            $http({
                method : 'GET',
                url : './api/member/search?q='+vm.searchNickname,
                headers: {'x-auth-token' : $sessionStorage.get('AuthToken')}
            }).then(function successCallback(response){

                vm.searchresult = response.data;

                for (var value in vm.searchresult){
                    if(vm.searchresult[value].profileImgPath == "") vm.searchresult[value].profileImgPath = vm.defaultimg;
                    else vm.searchresult[value].profileImgPath = "./profileimg/"+vm.searchresult[value].profileImgPath;
                }
                showsearch.focus();
            });
        }

        //피어 요청을 보내는 함수
        vm.sendrequest = function(seq){

            if(vm.peerlist.checklist.indexOf(seq) == -1){
                var con = confirm("피어 요청을 보내시겠습니까?");
                if(con == true){
                    $http({
                        method : 'POST',
                        url : './api/member/reqPeerFromMe',
                        data : $httpParamSerializerJQLike({
                            toSeq : seq
                        }),
                        headers: {
                            'Content-Type' : 'application/x-www-form-urlencoded',
                            'x-auth-token' : $sessionStorage.get('AuthToken')
                        }
                    }).then(function successCallback(response){
                        alert("요청을 보냈습니다.");
                    });
                }
            }
            else alert("이미 피어인 사용자입니다.");
        }

        //피어 요청을 수락하는 함수
        vm.requestaccept = function(user) {

            $http({
                method : 'POST',
                url : './api/member/reqPeerToMe',
                data : $httpParamSerializerJQLike({
                    toSeq : user.memberSeq,
                    type : true
                }),
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'x-auth-token' : $sessionStorage.get('AuthToken')
                }
            }).then(function (response){
                vm.peerlist.checklist.push(user.memberSeq);
                vm.deleteCheckItem(user);
                $http.get('./api/member/peer', {
                    headers : {'x-auth-token' : $sessionStorage.get('AuthToken')}
                }).then(function(responsepeer){
                    vm.peer = responsepeer.data;
                    vm.peerinit();
                    var showpeer = document.getElementById("showpeerlistcontainer");
                    showpeer.focus();
                });
            });

        }

        //피어 요청을 거부하는 함수
        vm.requestdenied = function(user) {

            $http({
                method : 'POST',
                url : './api/member/reqPeerToMe',
                data : $httpParamSerializerJQLike({
                    toSeq : user.memberSeq,
                    type : false
                }),
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'x-auth-token' : $sessionStorage.get('AuthToken')
                }
            }).then(function (response){
                vm.deleteCheckItem(user);
            });
        }

        vm.deleteCheckItem = function (item)
        {
            vm.request.splice(vm.request.indexOf(item), 1);
            focusChecklistInput();
        }

        function focusChecklistInput()
        {
            angular.element('#new-checklist-item-input').focus();
        }


        init();

        
    }

})();
