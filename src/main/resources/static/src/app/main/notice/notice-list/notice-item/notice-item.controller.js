(function ()
{
    'use strict';

    angular
        .module('app.notice.list.item')
        .controller('NoticeItemController', NoticeItemController);

    /** @ngInject */
    function NoticeItemController(NoticeItemData, $anchorScroll, $location, $state, $stateParams, mapLocation)
    {
        var vm = this;

        console.log(NoticeItemData);
        // data
        vm.noticeItem = NoticeItemData.data;
        vm.gotoMap = gotoMap;

        function init(){
            var old = $location.hash();
            $anchorScroll($location.hash('notice-table'));
            $location.hash(old);
        }
        


        function gotoMap(){
            mapLocation.lastLat = vm.noticeItem.location.center.lat;
            mapLocation.lastLng = vm.noticeItem.location.center.lng;
            mapLocation.searchResult.lat = vm.noticeItem.location.center.lat;
            mapLocation.searchResult.lng = vm.noticeItem.location.center.lng;
            mapLocation.searchResult.type = 'map';
            mapLocation.searchResult.id = vm.noticeItem.location.id;
            $state.go('app.map');
        } 

        init();
    }
})();
