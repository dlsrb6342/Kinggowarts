/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/main/toolbar/toolbar.controller.js
*  Author     : underkoo
*  Description: toolbar 모듈 컨트롤러 정의
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.main.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController(
        /* 모듈 */
        $document, 
        $http, 
        $mdDialog, 
        $mdSidenav, 
        $mdToast, 
        $q, 
        $rootScope, 
        $sessionStorage, 
        $state, 
        $timeout, 
        $translate, 

        /* 서비스 */
        mapLocation,
        msNavigationService, 
        profileImageFactory)
    {
        /* Data */
        var vm = this;

        /* 초기화 */
        $rootScope.global = {
            search: ''
        };
        vm.bodyEl = angular.element('body');
        vm.username = $sessionStorage.get('nickname');
        profileImageFactory.image_path = $sessionStorage.get('profileImgPath');
        vm.profileImg = profileImageFactory;
        vm.userStatusOptions = [
            {
                'title': '피어 요청 설정',
                'icon' : 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': '항상 수락',
                'icon' : 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': '항상 거절',
                'icon' : 'icon-minus-circle',
                'color': '#F44336'
            }
        ];

        function init()
        {
            // Select the first status as a default
            vm.userStatus = vm.userStatusOptions[0];

        }

        init();


        vm.setUserStatus = setUserStatus;
        vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;
        vm.toggleMsNavigationFolded = toggleMsNavigationFolded;
        vm.search = search;
        vm.searchResultClick = searchResultClick;
        vm.openProfileDialog = openProfileDialog;

        /* Methods */
        /**********************************************************************//**
        sidenav 토글. */
        vm.toggleSidenav = function (
            sidenavId) // 토글할 sidenav의 html DOM id
        {
            $mdSidenav(sidenavId).toggle();
        }

        /**********************************************************************//**
        모바일 메뉴 토글. */
        vm.toggleHorizontalMobileMenu = function ()
        {
            vm.bodyEl.toggleClass('ms-navigation-horizontal-mobile-menu-active');
        }

        /**********************************************************************//**
        msNavigation 접힌거 토글. */
        vm.toggleMsNavigationFolded = function ()
        {
            msNavigationService.toggleFolded();
        }

        /**********************************************************************//**
        user status 설정. */
        vm.setUserStatus = function (
            status) // user status JSON 오브젝트.
        {
            vm.userStatus = status;
        }

        /**********************************************************************//**
        로그아웃. 세션스토리지를 비우고 xwiki도 로그아웃하도록 함. */
        vm.logout = function ()
        {
            $sessionStorage.empty();
            $http({
                method : 'GET',
                url : '../xwiki/bin/logout/XWiki/XWikiLogout'
            })
            $state.go('app.login');
        }

        /**********************************************************************//**
        profile을 관리하는 dialog를 띄움. */
        vm.openProfileDialog = function (
            ev) // 현재 이벤트
        {
            $mdDialog.show({
                controller         : 'ProfileDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/toolbar/dialog/profile-dialog.html',
                parent             : angular.element($document.find('#content-container')),
                targetEvent        : ev,
                clickOutsideToClose: true
            });
        }

        /**********************************************************************//**
        검색을 위해 http 요청을 묶어서 보내는 함수.
        @returns {Promise} */
        vm.search = function (
            query) // 사용자에 의해 입력된 쿼리
        {
            //console.log(query);
            var mapSearchResult= $http({
                method : 'GET',
                url : "./api/map/search?q=" + query,
                headers: {'x-auth-token' : $sessionStorage.get('AuthToken')}
            })

            var markerSearchResult= $http({
                method : 'GET',
                url : "./api/marker/search?q=" + query,
                headers: {'x-auth-token' : $sessionStorage.get('AuthToken')}
            })

            var eventSearchResult= $http({
                method : 'GET',
                url : "./api/event/search?q=" + query,
                headers: {'x-auth-token' : $sessionStorage.get('AuthToken')}
            })

            var noticeSearchResult= $http({
                method : 'GET',
                url : "./api/notice/search?q=" + query,
                headers: {'x-auth-token' : $sessionStorage.get('AuthToken')}
            })

            var deferred = $q.all([mapSearchResult, markerSearchResult, eventSearchResult, noticeSearchResult]);

            return deferred;
        }

        /**********************************************************************//**
        검색된 결과를 클릭. */
        vm.searchResultClick = function (
            item) // 클릭한 item
        {
            //console.log(item);
            // title이 있으면 공지사항이므로
            if ("contents" in item)
            {
                //console.log('notice!');
                $state.go('app.main.notice.list.item', { title : item.category.name, id : item.id});
            }
            else if ("shape" in item){
                //console.log('map!');
                mapLocation.lastLat = item.center.lat;
                mapLocation.lastLng = item.center.lng;
                mapLocation.searchResult.lat = item.center.lat;
                mapLocation.searchResult.lng = item.center.lng;
                mapLocation.searchResult.type = 'map';
                mapLocation.searchResult.id = item.id;
                mapLocation.searchResult.cnt++;
                $state.go('app.main.map');
            }
            else if ("markerCategory" in item){
                //console.log('marker!');
                mapLocation.lastLat = item.center.lat;
                mapLocation.lastLng = item.center.lng;
                mapLocation.searchResult.lat = item.center.lat;
                mapLocation.searchResult.lng = item.center.lng;
                mapLocation.searchResult.type = item.markerCategory.name;
                mapLocation.searchResult.id = item.id;
                mapLocation.searchResult.cnt++;
                $state.go('app.main.map');
            }
            else {
                //console.log('event!');
                mapLocation.searchResult.type = 'event';
                mapLocation.searchResult.id = item.id;
                mapLocation.searchResult.l_id = item.l_id;
                mapLocation.searchResult.cnt++;
                $state.go('app.main.map');
            }
        }
    }

})();