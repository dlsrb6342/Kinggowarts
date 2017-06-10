(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [

            // Core
            'app.core',

            // main module
            'app.main',

            //login module
            'app.login',

            //register module
            'app.register',

            // Common 3rd-party engine
            'swxSessionStorage'
        ]);
})();