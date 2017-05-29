(function ()
{
    'use strict';

    angular
        .module('app.wiki')
        .controller('WikiController', WikiController);

    /** @ngInject */
    function WikiController($sce, $rootScope)
    {
        var vm = this;
        vm.path = $rootScope.wikipath
        
        vm.getUrl = function () {
            return $sce.trustAsResourceUrl(vm.path);
        };
       
    }
})();
