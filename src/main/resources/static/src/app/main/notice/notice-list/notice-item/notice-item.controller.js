(function ()
{
    'use strict';

    angular
        .module('app.notice.list.item')
        .controller('NoticeItemController', NoticeItemController);

    /** @ngInject */
    function NoticeItemController(NoticeItemData, $anchorScroll, $location, $stateParams)
    {
        var vm = this;

        console.log(NoticeItemData);
        // data
        vm.noticeItem = NoticeItemData.data;

        function init(){
            var old = $location.hash();
            $anchorScroll($location.hash('notice-table'));
            $location.hash(old);
        }
        
        init();
    }
})();
