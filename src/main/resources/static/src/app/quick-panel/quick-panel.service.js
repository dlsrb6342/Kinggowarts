(function ()
{
    'use strict';

    angular
        .module('app.quick-panel')
        .service('peerLocation', peerLocation);

    /** @ngInject */
    function peerLocation()
    {
        var service = this;
        service.lpeer = '';
    }

})();