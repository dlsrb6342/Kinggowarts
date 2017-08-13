/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/main/toolbar/toolbar.factory.js
*  Author     : underkoo
*  Description: toolbar 모듈에서 쓰이는 image path를 저장하는 factory
*******************************************************/

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