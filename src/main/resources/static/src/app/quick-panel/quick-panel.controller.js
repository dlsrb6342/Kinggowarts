(function ()
{
    'use strict';

    angular
        .module('app.quick-panel')
        .controller('QuickPanelController', QuickPanelController);

    /** @ngInject */
    function QuickPanelController(peerLocation, PeerData, RequestData, RecentwikiData, $http, $rootScope, $state, $sessionStorage, $httpParamSerializerJQLike)
    {
        var vm = this;

        vm.peer = PeerData.data;
        vm.request = RequestData.data;
        vm.recentwiki = RecentwikiData.data;

        vm.timeline = {
            currenttimeline : "skku",
            range : {
                skku : "학교",
                cs : "소프트웨어대학",
                fb : "페이스북"
            },
            notitime : {
                skku : [],
                cs : [],
                fb : []
            }
        };

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

        vm.imgsrc;

        var today = new Date();

        
        vm.findtimelinelocation = function (locid) {
            //구역 ID로 이동
            if(locid != 0){
                peerLocation.eventlocation = locid;
            }
        };

        function init()
        {
            for(var value in vm.peer){
                
                if(vm.peer[value].lat == -1 && vm.peer[value].lng == -1){
                    vm.peerlist.peer.n_active.push(vm.peer[value]);
                    vm.peerlist.peer.n_active[vm.peerlist.peer.n_active.length-1].weight = [vm.peerlist.peer.n_active.length-1];
                }
                else{
                    vm.peerlist.peer.active.push(vm.peer[value]);
                    vm.peerlist.peer.active[vm.peerlist.peer.active.length-1].weight = [vm.peerlist.peer.active.length-1];
                }
            }

            vm.getWikiLink();
            getnotice();
        };
        
        vm.getWikiLink = function () 
        {
            
            for (var i=0; i<vm.recentwiki.historySummaries.length; i++){
                if((vm.wikihistory.Name.indexOf(vm.recentwiki.historySummaries[i].pageId) == -1) && (vm.recentwiki.historySummaries[i].space.substring(0,6)=="XWiki."))
                {
                    vm.wikihistory.Name.push(vm.recentwiki.historySummaries[i].pageId);
                    var obj = {};
                    obj.Title = vm.recentwiki.historySummaries[i].space.substring(6);
                    obj.Link = '../xwiki/bin/view/XWiki/' + vm.recentwiki.historySummaries[i].space.substring(6);
                    vm.wikihistory.Link.push(obj);
                }
            }
        };

        function getnotice()
        {
            $http.get('./api/notice?all=false&category=skku&size=10&page=0', {
                headers : {'x-auth-token' : $sessionStorage.get('AuthToken')}
            }).then(function (response){
                groupnotice(response.data.content[0].category.name,response.data);
            });

            $http.get('./api/notice?all=false&category=cs&size=10&page=0', {
                headers : {'x-auth-token' : $sessionStorage.get('AuthToken')}
            }).then(function (response){
                groupnotice(response.data.content[0].category.name,response.data);
            });

            $http.get('./api/notice?all=false&category=fb&size=10&page=0', {
                headers : {'x-auth-token' : $sessionStorage.get('AuthToken')}
            }).then(function (response){
                groupnotice(response.data.content[0].category.name,response.data);
            });
        };
        function groupnotice(type, data){

            for (var value in data.content){

                data.content[value].time = (today.getTime() - data.content[value].time) / 86400000;

                if(data.content[value].time < 1) data.content[value].time = "오늘";
                else data.content[value].time = parseInt(data.content[value].time) + "일전";

                vm.timeline.notitime[type].push(data.content[value]);
            }
        };

        vm.wikigo = function (wikilink) 
        {
            //wiki state일 때는 reload, 아닐때는 wikistate로

            $rootScope.wikipath=wikilink;

            if($state.includes('app.wiki') == true)
            {
                $state.reload();
            }
            else
            {
                $state.go('app.wiki');
            }
            
        };
        

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

        vm.deletepeer = function(delpeer) {

            var con = confirm("정말로 삭제하시겠습니까?");

            if (con == true) {
                $http({
                    method : 'DELETE',
                    url : './api/member/peer',
                    data : $httpParamSerializerJQLike({
                        toSeq : delpeer.memberSeq
                    }),
                    headers: {
                        'Content-Type' : 'application/x-www-form-urlencoded',
                        'x-auth-token' : $sessionStorage.get('AuthToken')
                    }
                }).then(function (response){
                    if(delpeer.checked == true){
                        vm.toggle(delpeer,vm.selected[vm.peerlist.currentlocation]);
                    }
                    vm.peerlist.peer[vm.peerlist.currentlocation].splice(vm.peerlist.peer[vm.peerlist.currentlocation].indexOf(delpeer),1);
                    focusChecklistInput();
                });
            }
            
        }

        vm.finduser = function(){

            var nickname = document.getElementById("nickname").value;

            console.log(nickname);

            $http({
                method : 'POST',
                url : './api/member/reqPeerFromMe',
                data : $httpParamSerializerJQLike({
                    toSeq : nickname
                }),
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'x-auth-token' : $sessionStorage.get('AuthToken')
                }
            }).then(function successCallback(response){
                
            }, function errorCallback(response) {
                
            });
        }

        vm.sendrequest = function(){
            //요청 보내기

            // $http({
            //     method : 'POST',
            //     url : './api/',
            //     data : $httpParamSerializerJQLike({

            //     }),
            //     headers: {'Content-Type' : 'application/x-www-form-urlencoded'}
            // });
        }

        vm.requestaccept = function(seq) {

            $http({
                method : 'POST',
                url : './api/member/reqPeerToMe',
                data : $httpParamSerializerJQLike({
                    toSeq : seq.memberSeq,
                    type : true
                }),
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'x-auth-token' : $sessionStorage.get('AuthToken')
                }
            }).then(function (response){
                vm.deleteCheckItem(item);
            });
        }

        vm.requestdenied = function(seq) {

            $http({
                method : 'POST',
                url : './api/member/reqPeerToMe',
                data : $httpParamSerializerJQLike({
                    toSeq : seq.memberSeq,
                    type : false
                }),
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'x-auth-token' : $sessionStorage.get('AuthToken')
                }
            }).then(function (response){
                vm.deleteCheckItem(item);
            });
        }

        vm.deleteCheckItem = function (item)
        {
            vm.request.request.splice(vm.request.request.indexOf(item), 1);
            focusChecklistInput();
        }

        function focusChecklistInput()
        {
            angular.element('#new-checklist-item-input').focus();
        }


        init();

        
    }

})();