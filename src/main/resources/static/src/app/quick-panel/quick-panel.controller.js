(function ()
{
    'use strict';

    angular
        .module('app.quick-panel')
        .controller('QuickPanelController', QuickPanelController);

    /** @ngInject */
    function QuickPanelController(msApi, peerLocation, TimelineData, PeerData, RequestData, RecentwikiData)
    {
        var vm = this;
        
        vm.timeline = TimelineData.data;
        vm.peer = PeerData.data;
        vm.request = RequestData.data;
        vm.recentwiki = RecentwikiData.data;

        vm.currenttimeline = "SE";
        vm.currentlocation = "ST";

        vm.peerrange = {

            ST : 'Student',
            PF : 'Professor'

        };

        vm.selected = [];

        

        vm.findtimelinelocation = function(ID) {
            //구역 ID로 이동
        }

        function init()
        {
            for (var value in vm.peer.location["ST"]){
                if(vm.peer.location["ST"][value].checked == true){
                    vm.toggle(vm.peer.location["ST"][value],vm.selected);
                }
            }
            for (var value in vm.peer.location["PF"]){
                if(vm.peer.location["PF"][value].checked == true){
                    vm.toggle(vm.peer.location["PF"][value],vm.selected);
                }
            }
        }

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
            return (vm.selected.length !== 0 &&
                vm.selected.length !== vm.peer.location[vm.currentlocation].length+1);
        };

        vm.isChecked = function() {
            return vm.selected.length === vm.peer.location[vm.currentlocation].length+1;
          };
          
        vm.toggleAll = function() {
            if (vm.selected.length === vm.peer.location[vm.currentlocation].length+1) {
              vm.selected = [];
            } else if (vm.selected.length === 0 || vm.selected.length > 0) {
                for (var value in vm.peer.location[vm.currentlocation]){
                    vm.toggle(vm.peer.location[vm.currentlocation][value],vm.selected);
                }
            }
         };
         
        vm.untoggleAll = function() {
            vm.selected = [];
            for (var value in vm.peer.location[vm.currentlocation]){
                vm.peer.location[vm.currentlocation][value].checked = false;
            }
            peerLocation.peer = vm.peer;
        };



        vm.requestaccept = function(item) {
            //수락 했을 때
            vm.deleteCheckItem(item);
        }

        vm.requestdenied = function(item) {
            //거절 했을 때
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