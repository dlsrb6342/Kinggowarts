(function ()
{
    'use strict';

    angular
        .module('app.notice.list')
        .controller('NoticeListController', NoticeListController);

    /** @ngInject */
    function NoticeListController(NoticeListData, $state, $stateParams)
    {
        var vm = this;

        // data
        vm.title = $stateParams.title;
        vm.noticeList = NoticeListData.data;


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
        switch($stateParams.title){
            case 'skku' :
                vm.title = '성균관대학교';
                break;
            case 'facebook' :
                vm.title = 'Facebook';
                break;
            case 'computer-science' :
                vm.title = '소프트웨어대학';
                break;
            default :
                vm.title = '성균관대학교';
                break;
        }

        vm.dtOptions = {
            dom       : '<"top"<"left"<"length"l>><"right"f>>rt<"bottom"<"left"<"info"i>><"right"<"pagination"p>>>',
            pagingType: 'full_numbers',
            autoWidth : false,
            responsive: true,
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
})();
