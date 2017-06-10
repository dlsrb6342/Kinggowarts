(function ()
{
    'use strict';

    angular
        .module('app.main.toolbar')
        .factory('profileImageFactory', profileImageFactory);

    /** @ngInject */
    function profileImageFactory()
    {

        var service = {};
        service.image_path = "";

        return service;
    }
})();