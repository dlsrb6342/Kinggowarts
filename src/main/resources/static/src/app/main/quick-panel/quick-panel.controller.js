/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/main/quick-panel/quick-panel.controller.js
*  Author     : HongGiwon
*  Description: quick-panel 각 tab의 data를 불러오기 위한 controller. 
                각 tab의 controller는 src/app/core/directives/ms-quickpanel/ms-quickpanel.directive.js에 정의됨.
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.main.quick-panel')
        .controller('QuickPanelController', QuickPanelController);

    /** @ngInject */
    function QuickPanelController(
        
        // 데이터
        NoticeCategoryData,

        // 모듈
        $http,
        $httpParamSerializerJQLike, 
        $sessionStorage,
        $q

        // 서비스
        )
    {
        
        var vm = this;

        vm.timelineList;
        vm.peer;
        vm.request;
        vm.recentwiki;
        vm.notice_category = NoticeCategoryData.data;

        vm.loadingFlagT = false;
        vm.loadingFlagP = false;
        vm.loadingFlagR = false;
        vm.loadingFlagW = false;

        vm.timelineListDataResolver = function(){

            vm.loadingFlagT = false;
            vm.loadingFlagP = false;
            vm.loadingFlagR = false;
            vm.loadingFlagW = false;
            var request_array = [];

            for(var i in vm.notice_category){

                var notice_request= $http({
                    method : 'GET',
                    url : './api/notice?all=false&category=' + vm.notice_category[i].name + '&size=10&page=0',
                    headers: {'x-auth-token' : $sessionStorage.get('AuthToken')}
                })
                request_array[i] = notice_request;
            }

            var obj = $q.all(request_array);
            obj.then(
                function(data){
                    vm.timelineList = data;
                    vm.loadingFlagT = true;
                }
            );
            
        }

        vm.timelineListDataResolver();

        vm.peerDataResolver = function(){

            vm.loadingFlagT = false;
            vm.loadingFlagP = false;
            vm.loadingFlagR = false;
            vm.loadingFlagW = false;
            var obj = $http.get('./api/member/peer', {
                headers : {'x-auth-token' : $sessionStorage.get('AuthToken')}
            });

            obj.then(
                function(data){
                    vm.peer = data.data;
                    vm.loadingFlagP = true;
                }
            );

        }
        vm.requestDataResolver = function(){
            
            vm.loadingFlagT = false;
            vm.loadingFlagP = false;
            vm.loadingFlagR = false;
            vm.loadingFlagW = false;
            var obj = $http.get('./api/member/reqPeerToMe', {
                headers : {'x-auth-token' : $sessionStorage.get('AuthToken')}
            });
            
            obj.then(
                function(data){
                    vm.request = data.data;
                    vm.loadingFlagR = true;
                }
            );
        }
        vm.recentwikiDataResolver = function(){

            vm.loadingFlagT = false;
            vm.loadingFlagP = false;
            vm.loadingFlagR = false;
            vm.loadingFlagW = false;
            var obj= $http.get('../xwiki/rest/wikis/xwiki/query?q=where++(doc.hidden+<>+true+or+doc.hidden+is+null)+and+doc.fullName+not+in+(select+doc.fullName+from+XWikiDocument+doc%2c+BaseObject+obj+where+obj.name+%3d+doc.fullName+and+obj.className+%3d+%27XWiki.XWikiUsers%27)+and+(doc.space+like+%27XWiki%27+or+doc.space+like+%27XWiki.%25%27)++order+by+doc.date+desc&type=hql&start=0&number=23');
            
            obj.then(
                function(data){
                    vm.recentwiki = data.data.searchResults;
                    vm.loadingFlagW = true;
                }
            );
        }

        
    }

})();
