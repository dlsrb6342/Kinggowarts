(function ()
{
    'use strict';

    angular
        .module('app.quick-panel')
        .controller('QuickPanelController', QuickPanelController);

    /** @ngInject */
    function QuickPanelController(msApi)
    {
        var vm = this;

        vm.currenttimeline = 'SE';
        vm.currentlocation = 'ST';

        vm.peerrange = {
            ST: "Student",
            PF: "Professor"
        };

        vm.findtimelinelocation = function(locationID) {
            
            //해당 구역으로 이동
        }

        vm.selected = [1];
        vm.toggle = function (item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
              list.splice(idx, 1);
            }
            else {
              list.push(item);
            }
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
                    vm.toggle(vm.peer.location[vm.currentlocation][value].weight,vm.selected);
                }
            }
         };
         
        vm.untoggleAll = function() {
              vm.selected = [];
         };

        vm.requestaccept = function(item) {
            vm.deleteCheckItem(item);

            //서버에 성공한 사실과 ID 전달
        }

        vm.requestdenied = function(item) {
            vm.deleteCheckItem(item);

            //서버에 실패한 사실과 ID 전달
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


        msApi.request('quickPanel.timeline@get', {},
            // Success
            function (response)
            {
                vm.timeline = response.data;
            }
        );

        msApi.request('quickPanel.peer@get', {},
            // Success
            function (response)
            {
                vm.peer = response.data;
            }
        );

        msApi.request('quickPanel.request@get', {},
            // Success
            function (response)
            {
                vm.request = response.data;
            }
        );

        msApi.request('quickPanel.recentwiki@get', {},
            // Success
            function (response)
            {
                vm.recentwiki = response.data;
            }
        );

        // Methods

        //////////
    }

})();