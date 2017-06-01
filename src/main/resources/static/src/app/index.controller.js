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
        $rootScope.wikipath = "../xwiki/bin/view/XWiki/";

        // Data
        vm.themes = fuseTheming.themes;

        //////////
    }
})();