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

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',

            // Quick Panel
            'app.quick-panel',

            // Sample
            'app.sample',

            //daum map module
            'app.map',

            //wiki module
            'app.wiki',

            //notice module
            'app.notice'
        ]);
})();