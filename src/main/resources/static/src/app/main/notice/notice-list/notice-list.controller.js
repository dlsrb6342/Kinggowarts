/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/main/notice/notice-list/notice-list.controller.js
*  Author     : underkoo
*  Description: notice-list 모듈 컨트롤러
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.main.notice.list')
        .controller('NoticeListController', NoticeListController);

    /** @ngInject */
    function NoticeListController(
        /* 데이터 */
        NoticeCategoryData, 
        NoticeListData, 

        /* 모듈 */
        $mdSidenav, 
        $state, 
        $stateParams, 
        $window)
    {
        /* Data */
        var vm = this;
        vm.noticeList = NoticeListData.data;

        /* 초기화 */
        /* 데이터 테이블 한글 설정. */
        var oLanguage = {
            sSearch: '검색 : ',
            sLengthMenu: '_MENU_ 개씩 보기',
            sEmptyTable: '데이터가 없습니다.',
            sInfo: '_TOTAL_개 중 _START_에서 _END_번째',
            sInfoEmpty: '총 0개',
            sZeroRecords: '일치하는 데이터가 없습니다.',
            sInfoFiltered: '(총 _MAX_개 중)',
            oPaginate: {
                sFirst: '처음',
                sLast: '마지막',
                sNext: '다음',
                sPrevious: '이전'
            }                   
        };

        /* 제목 카테고리 데이터에서 읽어서 한글 이름으로 설정. */
        for (var i in NoticeCategoryData.data){
            if(NoticeCategoryData.data[i].name == $stateParams.category){
                vm.title = NoticeCategoryData.data[i].korean_name;
                break;
            }
        }

        /* 데이터 테이블 css 설정 */
        if($window.innerWidth > 450)
        {
            vm.dtOptions = {
                dom       : '<"top"<"left"<"length"l>><"right"f>>rt<"bottom"<"left"<"info hide-xs"i>><"right"<"pagination"p>>>',
                pagingType: 'full_numbers',
                autoWidth : false,
                responsive: false,
                language: oLanguage,
                order     : [0, 'desc'],
                columnDefs: [
                    {
                      width    : '10%',
                      targets  : [0]
                    },
                    {
                      width  : '60%',
                      orderable : false,
                      targets: [1]
                    },
                    {
                      width  : '20%',
                      targets: [2]
                    },
                    {
                      width  : '10%',
                      targets: [3]
                    }
                ]
            };
        }
        else // 모바일인 경우
        { 
            vm.dtOptions = {
                dom       : '<"top"<"left"<"length"l>><"right"f>>rt<"bottom"<"left"<"info">><"right"<"pagination"p>>>',
                pagingType: 'full',
                autoWidth : false,
                responsive: false,
                language: oLanguage,
                order     : [0, 'desc'],
                columnDefs: [
                    {
                      width    : '20%',
                      targets  : [0]
                    },
                    {
                      width  : '80%',
                      orderable : false,
                      targets: [1]
                    }
                ]
            };
        }

        /* Methods */
        /**********************************************************************//**
        사이드 네비게이션을 토글하는 함수. */
        vm.toggleSidenav = function(
            sidenavId) // 사이드 네비게이션 html의 DOM id값을 받아옴.
        {
            $mdSidenav(sidenavId).toggle();
        }
    }
})();
