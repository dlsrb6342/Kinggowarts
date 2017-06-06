(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .controller('ToolbarController', ToolbarController);

    /** @ngInject */
    function ToolbarController($rootScope, $q, $state, $timeout, $mdSidenav, $translate, $mdToast, msNavigationService, $sessionStorage, $http)
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

        vm.userID = $sessionStorage.get('nickname');


        // Methods
        vm.toggleSidenav = toggleSidenav;
        vm.logout = logout;
        vm.setUserStatus = setUserStatus;
        vm.toggleHorizontalMobileMenu = toggleHorizontalMobileMenu;
        vm.toggleMsNavigationFolded = toggleMsNavigationFolded;
        vm.search = search;
        vm.searchResultClick = searchResultClick;

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

            // var navigation = [],
            //     flatNavigation = msNavigationService.getFlatNavigation(),
            //     deferred = $q.defer();


            // for ( var x = 0; x < flatNavigation.length; x++ )
            // {
            //     if ( flatNavigation[x].uisref )
            //     {
            //         navigation.push(flatNavigation[x]);
            //     }
            // }


            // if ( query )
            // {
            //     navigation = navigation.filter(function (item)
            //     {
            //         if ( angular.lowercase(item.title).search(angular.lowercase(query)) > -1 )
            //         {
            //             return true;
            //         }
            //     });
            // }

            // $timeout(function ()
            // {
            //     deferred.resolve(navigation);
            // }, 1000);

            // return deferred.promise;
        }

        /**
         * Search result click action
         *
         * @param item
         */
        function searchResultClick(item)
        {
            console.log(item);
            // title이 있으면 공지사항이므로.ㄷ
            if (item.title)
            {
                $state.go('app.notice.list.item', { title : item.category.name, id : item.id});
            }
        }
    }

})();