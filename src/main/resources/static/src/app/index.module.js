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

            // Toolbar
            'app.toolbar',

            // Quick Panel
            'app.quick-panel',

            //daum map module
            'app.map',

            //wiki module
            'app.wiki',

            //notice module
            'app.notice',

            //login module
            'app.login'
        ]);
})();