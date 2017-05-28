(function ()
{
    'use strict';

    angular
        .module('app.notice.facebook')
        .controller('FacebookController', FacebookController);

    /** @ngInject */
    function FacebookController(FacebookList)
    {
        var vm = this;
        vm.facebookList = FacebookList.data

        vm.dtOptions = {
            dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth : false,
            responsive: true
        };

        console.log(FacebookList);
    }
})();
