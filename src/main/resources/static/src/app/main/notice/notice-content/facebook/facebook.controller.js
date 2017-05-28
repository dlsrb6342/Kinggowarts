(function ()
{
    'use strict';

    angular
        .module('app.notice.facebook')
        .controller('FacebookController', FacebookController);

    /** @ngInject */
    function FacebookController(FacebookData, $sessionStorage, $state)
    {
        var vm = this;

        //로그인 되어있지 않은 사용자가 공지사항에 접근시 로그인 페이지로 돌려보냄
        function usercheck(){
            var userval = $sessionStorage.get('useremail');
            if(userval == undefined){
                alert('로그인 되어 있지 않거나 세션 유효기간이 끝나 로그아웃 되었습니다.');
                $state.go('login');
            }
        };
        usercheck();

        vm.dtOptions = {
            dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth : false,
            responsive: true
        };
        console.log(FacebookData);
    }
})();
