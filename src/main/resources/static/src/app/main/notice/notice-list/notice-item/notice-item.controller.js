/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/main/notice/notice-list/notice-item/notice-item.controller.js
*  Author     : underkoo
*  Description: notice-item 모듈 컨트롤러
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.main.notice.list.item')
        .controller('NoticeItemController', NoticeItemController);

    /** @ngInject */
    function NoticeItemController(
        /* 데이터 */
        NoticeItemData, 

        /* 모듈 */
        $anchorScroll, 
        $location, 
        $state, 
        $stateParams,

        /* 서비스 */
        mapLocation)
    {
        /* Data */
        var vm = this;
        vm.noticeItem = NoticeItemData.data;

        /* 초기화 */
        function init(){
            /* 현재 아이템의 위치로 창 이동 */
            var old = $location.hash();
            $anchorScroll($location.hash('notice-table'));
            $location.hash(old);
        }
        
        init();

        /* Methods */
        /**********************************************************************//**
        map의 해당위치로 이동하는 함수. */
        vm.gotoMap = function (){
            mapLocation.lastLat = vm.noticeItem.location.center.lat;
            mapLocation.lastLng = vm.noticeItem.location.center.lng;
            mapLocation.searchResult.lat = vm.noticeItem.location.center.lat;
            mapLocation.searchResult.lng = vm.noticeItem.location.center.lng;
            mapLocation.searchResult.type = 'map';
            mapLocation.searchResult.id = vm.noticeItem.location.id;
            $state.go('app.main.map');
        } 
    }
})();
