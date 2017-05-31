(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming, $rootScope)
    {
        var vm = this;
        $rootScope.wikipath = "http://fanatic1.iptime.org:8080/xwiki/bin/view/XWiki/";

        // Data
        vm.themes = fuseTheming.themes;

        //////////
    }
})();