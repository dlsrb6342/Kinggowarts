/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/core/directives/ms-quickpanel/ms-quickpanel.directive.js
*  Author     : HongGiwon
*  Description: quick-panel 각 tab들의 directive와 controller를 정의.
                quick-panel의 controller와 module은 src/app/main/quick-panel에 정의됨.
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.core')

        //timeline
        .controller('QuickPanelTimelineController', QuickPanelTimelineController)
        .directive('msQptimeline', msQpTimelineDirective)

        //peer
        .directive('msQppeer', msQpPeerDirective)
        .controller('QuickPanelPeerController', QuickPanelPeerController)
        .controller('QuickPanelRequestDialogController', QuickPanelRequestDialogController)

        //wiki
        .directive('msQprecentwiki', msQpRecentwikiDirective)
        .controller('QuickPanelRecentwikiController', QuickPanelRecentwikiController);


    /** @ngInject */
    function QuickPanelTimelineController(
        
        // 데이터

        // 모듈
        $state,
        $scope,

        // 서비스
        mapLocation
        
        
        )
    {

        var vm = this;

        vm.timelineList = $scope.timelineData;
        vm.notice_category = $scope.categoryData;

        vm.gotoTimelineNotice = function (timelineId, timelineCategory) {
            //해당 글로 이동
            if(timelineId != 0 && timelineId != undefined){
                $state.go('app.main.notice.list.item', { category : timelineCategory, id : timelineId});
            }
        };
        
        vm.gotoTimelineLocation = function (location) {
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
        
    }

     /** @ngInject */
    function QuickPanelPeerController(
        // 데이터

        // 모듈
        $http, 
        $scope,
        $sessionStorage,
        $httpParamSerializerJQLike,
        $mdDialog,

        // 서비스
        mapLocation, 
        peerLocation
        )
    {

        
        var vm = this;

        //peer
        vm.peer = $scope.peerData;

        vm.peerlist = {
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

        vm.selected = {
            active : [],
            n_active : []
        };

        vm.defaultimg = "./assets/images/avatars/profile.jpg";

        //request
        vm.request = $scope.requestData;

        vm.searchresult;

        //peer fun
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
                        vm.peerInit();
                        var showpeer = document.getElementById("showpeerlistcontainer");
                        showpeer.focus();
                    });
                }
            }, true);

        //peer정보를 처리하는 함수
        vm.peerInit = function(){
            
            vm.peerlist.peer.active= [];
            vm.peerlist.peer.n_active = [];
            for(var value in vm.peer){
                
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
            for(var per in vm.request){
                if(vm.request[per].profileImgPath == "") vm.request[per].profileImgPath = vm.defaultimg;
                else vm.request[per].profileImgPath = "./profileimg/"+ vm.request[per].profileImgPath;
            }
            peerLocation.peer = vm.peerlist.peer;
            peerLocation.modified += 1;
        }
        
        vm.peerInit();

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
            peerLocation.modified += 1;
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
            peerLocation.modified += 1;
        };

        //피어를 삭제하는 함수
        vm.deletePeer = function(delpeer) {

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
                    vm.peerlist.peer[vm.peerlist.currentlocation].splice(vm.peerlist.peer[vm.peerlist.currentlocation].indexOf(delpeer),1);
                    focusChecklistInput();
                });
            }
            
        }

        function focusChecklistInput()
        {
            angular.element('#new-checklist-item-input').focus();
        }

        //request fun
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
                vm.deleteCheckItem(user);
                var showpeer = document.getElementById("showpeerlistcontainer");
                showpeer.focus();
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

        vm.showRequestDialog = function ()
        {
            $mdDialog.show({
                controller          : 'QuickPanelRequestDialogController',
                controllerAs        : 'vm',
                templateUrl         : 'app/core/directives/ms-quickpanel/templates/peer/requestDialog.html',
                parent              : angular.element(document.body),
                clickOutsideToClose : true,
                fullscreen          : false, // Only for -xs, -sm breakpoints.
                resolve:{
                    PeerData : function(){
                        return vm.peer;
                    }                  
                }
            });
        }
        
    }

    /** @ngInject */
    function QuickPanelRequestDialogController(
        // 데이터
        PeerData,

        // 모듈 
        $http, 
        $sessionStorage,
        $httpParamSerializerJQLike
    )
    {
        var vm = this;
        vm.searchresult;
        vm.defaultimg = "./assets/images/avatars/profile.jpg";
        vm.peercheck = [];
        vm.userseq = $sessionStorage.get('memberSeq');

        for (var pitem in PeerData){
            vm.peercheck.push(PeerData[pitem].memberSeq);
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

            if(vm.peercheck.indexOf(seq) == -1 && seq != vm.userseq){
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
            else alert("요청을 보낸 대상이 이미 피어인 사용자, 혹은 자기 자신입니다.");
        }
    }

    /** @ngInject */
    function QuickPanelRecentwikiController(
        // 데이터

        // 모듈   
        $rootScope, 
        $state,
        $scope

        // 서비스
        )
    {
        var vm = this;

        vm.recentwiki = $scope.recentwikiData;

        vm.wikihistory = {
            Name : [],
            Link : []
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

        vm.getWikiLink();  

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
    }


    /** @ngInject */
    function msQpTimelineDirective()
    {
        return {
            restrict: 'E',
            scope   : {
                timelineData : '=timelineData',
                categoryData : '=categoryData'
            },
            templateUrl : 'app/core/directives/ms-quickpanel/templates/timeline/timeline.html',
            controller      : 'QuickPanelTimelineController as vm'
            
        };
    }

    /** @ngInject */
    function msQpPeerDirective()
    {
        return {
            restrict: 'E',
            scope   : {
                peerData : '=peerData',
                requestData : '=requestData'
            },
            templateUrl : 'app/core/directives/ms-quickpanel/templates/peer/peer.html',
            controller      : 'QuickPanelPeerController as vm'
            
        };
    }

    /** @ngInject */
    function msQpRecentwikiDirective()
    {
        return {
            restrict: 'E',
            scope   : {
                recentwikiData : '=recentwikiData'
            },
            templateUrl : 'app/core/directives/ms-quickpanel/templates/recentwiki/recentwiki.html',
            controller      : 'QuickPanelRecentwikiController as vm'
        };
    }

    
})();
