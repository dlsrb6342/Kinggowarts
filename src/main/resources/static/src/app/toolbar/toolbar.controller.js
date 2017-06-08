(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController($document, $rootScope, $q, $state, $timeout, $mdSidenav, $mdDialog, $translate, $mdToast, msNavigationService, $sessionStorage, $http, profileImageFactory, mapLocation)
    {
        var vm = this;

        // Data
        $rootScope.global = {
            search: ''
        };

        vm.bodyEl = angular.element('body');
        vm.userStatusOptions = [
            {
                'title': 'User choose',
                'icon' : 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Always accept',
                'icon' : 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Always refuse',
                'icon' : 'icon-minus-circle',
                'color': '#F44336'
            }
        ];

        vm.username = $sessionStorage.get('nickname');
        profileImageFactory.image_path = $sessionStorage.get('profileImgPath');
        vm.profileImg = profileImageFactory;


        // Methods
        vm.toggleSidenav = toggleSidenav;
        vm.logout = logout;
        vm.setUserStatus = setUserStatus;
        vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;
        vm.toggleMsNavigationFolded = toggleMsNavigationFolded;
        vm.search = search;
        vm.searchResultClick = searchResultClick;
        vm.openProfileDialog = openProfileDialog;

        //////////

        init();

        /**
         * Initialize
         */
        function init()
        {
            // Select the first status as a default
            vm.userStatus = vm.userStatusOptions[0];

        }


        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId)
        {
            $mdSidenav(sidenavId).toggle();
        }

        /**
         * Sets User Status
         * @param status
         */
        function setUserStatus(status)
        {
            vm.userStatus = status;
        }

        /**
         * Logout Function
         */
        function logout()
        {
            $state.go('login');
        }

        /**
         * Toggle horizontal mobile menu
         */
        function toggleHorizontalMobileMenu()
        {
            vm.bodyEl.toggleClass('ms-navigation-horizontal-mobile-menu-active');
        }

        /**
         * Toggle msNavigation folded
         */
        function toggleMsNavigationFolded()
        {
            msNavigationService.toggleFolded();
        }

        /**
         * Search action
         *
         * @param query
         * @returns {Promise}
         */
        function search(query)
        {
            console.log(query);
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

        function searchResultClick(item)
        {
            console.log(item);
            // title이 있으면 공지사항이므로
            if ("contents" in item)
            {
                console.log('notice!');
                $state.go('app.notice.list.item', { title : item.category.name, id : item.id});
            }
            else if ("shape" in item){
                console.log('map!');
                mapLocation.lastLat = item.center.lat;
                mapLocation.lastLng = item.center.lng;
                mapLocation.searchResult.lat = item.center.lat;
                mapLocation.searchResult.lng = item.center.lng;
                mapLocation.searchResult.type = 'map';
                mapLocation.searchResult.id = item.id;
                mapLocation.searchResult.cnt++;
                $state.go('app.map');
            }
            else if ("markerCategory" in item){
                console.log('marker!');
                mapLocation.lastLat = item.center.lat;
                mapLocation.lastLng = item.center.lng;
                mapLocation.searchResult.lat = item.center.lat;
                mapLocation.searchResult.lng = item.center.lng;
                mapLocation.searchResult.type = item.markerCategory.name;
                mapLocation.searchResult.id = item.id;
                mapLocation.searchResult.cnt++;
                $state.go('app.map');
            }
            else {
                console.log('event!');
                //mapLocation.lastLat = item.creator.lat;
                //mapLocation.lastLng = item.creator.lng;   creator 속성이 제거되었습니다.
                //mapLocation.searchResult.lat = item.creator.lat;
                //mapLocation.searchResult.lng = item.creator.lng;
                mapLocation.searchResult.type = 'event';
                mapLocation.searchResult.id = item.id;
                mapLocation.searchResult.l_id = item.l_id;
                mapLocation.searchResult.cnt++;
                $state.go('app.map');
            }
        }

        function openProfileDialog(ev)
        {
            $mdDialog.show({
                controller         : 'ProfileDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/toolbar/dialog/profile-dialog.html',
                parent             : angular.element($document.find('#content-container')),
                targetEvent        : ev,
                clickOutsideToClose: true
            });
        }
    }

})();