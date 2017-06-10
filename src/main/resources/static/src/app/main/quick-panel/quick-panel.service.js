(function ()
{
    'use strict';

    angular
        .module('app.core')
        .service('peerLocation', peerLocation);

    /** @ngInject */
    function peerLocation()
    {
        var service = this;
        service.peer = '';
    }

})();