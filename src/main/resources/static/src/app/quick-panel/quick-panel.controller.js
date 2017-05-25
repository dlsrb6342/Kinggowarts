(function ()
{
    'use strict';

    angular
        .module('app.quick-panel')
        .controller('QuickPanelController', QuickPanelController);

    /** @ngInject */
    function QuickPanelController(peerLocation, TimelineData, PeerData, RequestData, RecentwikiData, $http)
    {
        var vm = this;

        vm.timeline = TimelineData.data.data;
        vm.peer = PeerData.data.data;
        vm.request = RequestData.data.data;

        vm.recentwiki = RecentwikiData.data;

        vm.currenttimeline = "SE";
        vm.currentlocation = "ST";

        vm.peerrange = {

            ST : 'Student',
            PF : 'Professor'

        };

        vm.selected = {
            ST : [],
            PF : []
        };

        vm.wikihistory = {
            Name : [],
            Link : []
        };

        
        vm.findtimelinelocation = function (event) {
            //구역 ID로 이동
            peerLocation.eventlocation = event.location;
        };

        function init()
        {
            for (var value in vm.peer.location["ST"]){
                vm.peer.location["ST"][value].weight = [value];
                if(vm.peer.location["ST"][value].checked == true){
                    vm.toggle(vm.peer.location["ST"][value],vm.selected["ST"]);
                }
            }
            for (var value in vm.peer.location["PF"]){
                vm.peer.location["PF"][value].weight = [value];
                if(vm.peer.location["PF"][value].checked == true){
                    vm.toggle(vm.peer.location["PF"][value],vm.selected["PF"]);
                }
            }

            vm.getWikiLink();
        };
        
        vm.getWikiLink = function () 
        {
            
            for (var i=0; i<vm.recentwiki.historySummaries.length; i++){
                if((vm.wikihistory.Name.indexOf(vm.recentwiki.historySummaries[i].pageId) == -1) && (vm.recentwiki.historySummaries[i].space.substring(0,6)=="XWiki."))
                {
                    vm.wikihistory.Name.push(vm.recentwiki.historySummaries[i].pageId);
                    var obj = {};
                    obj.Title = vm.recentwiki.historySummaries[i].space.substring(6);
                    obj.Link = 'http://fanatic1.iptime.org:8080/xwiki/bin/view/XWiki/' + vm.recentwiki.historySummaries[i].space.substring(6);
                    vm.wikihistory.Link.push(obj);
                }
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
            peerLocation.peer = vm.peer;
        };

        vm.exists = function (item, list) {
            return list.indexOf(item) > -1;
        };

        vm.isIndeterminate = function() {
            return (vm.selected[vm.currentlocation].length !== 0 &&
                vm.selected[vm.currentlocation].length !== vm.peer.location[vm.currentlocation].length+1);
        };

        vm.isChecked = function() {
            return vm.selected[vm.currentlocation].length === vm.peer.location[vm.currentlocation].length+1;
          };
          
        vm.toggleAll = function() {
            for (var value in vm.peer.location[vm.currentlocation]){
                vm.toggle(vm.peer.location[vm.currentlocation][value],vm.selected[vm.currentlocation]);
            }
        };
         
        vm.untoggleAll = function() {
            vm.selected[vm.currentlocation] = [];
            for (var value in vm.peer.location[vm.currentlocation]){
                vm.peer.location[vm.currentlocation][value].checked = false;
            }
            peerLocation.peer = vm.peer;
        };

        vm.deletepeer = function(delpeer) {
            if(delpeer.checked == true){
                vm.toggle(delpeer,vm.selected[vm.currentlocation]);
            }
            console.log(vm.selected[vm.currentlocation]);
            vm.peer.location[vm.currentlocation].splice(vm.peer.location[vm.currentlocation].indexOf(delpeer),1);
            focusChecklistInput();

            //peer 위치 공유 제거 했을 때 서버에 post 추가 필요
            
        }

        vm.requestaccept = function(item) {

            //수락 했을 때 서버에 post 추가 필요 

            vm.deleteCheckItem(item);
        }

        vm.requestdenied = function(item) {

            //거절 했을 때 서버에 post 추가 필요

            vm.deleteCheckItem(item);
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

        // Methods

        //////////
    }

})();