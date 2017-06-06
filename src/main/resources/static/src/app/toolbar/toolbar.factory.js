(function ()
{
    'use strict';

    angular
        .module('app.toolbar')
        .factory('profileImageFactory', profileImageFactory);

    /** @ngInject */
    function profileImageFactory()
    {

        var service = {};
        service.image_path = "";

        return service;
    }
})();