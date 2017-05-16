(function ()
{
    'use strict';

    angular
        .module('app.quick-panel', [])
        .config(config);

    /** @ngInject */
    function config($translatePartialLoaderProvider, msApiProvider)
    {
        // Translation
        $translatePartialLoaderProvider.addPart('app/quick-panel');

        // Api
        msApiProvider.register('quickPanel.timeline', ['app/data/quick-panel/timeline.json']);
        msApiProvider.register('quickPanel.peer', ['app/data/quick-panel/peer.json']);
        msApiProvider.register('quickPanel.request', ['app/data/quick-panel/request.json']);
        msApiProvider.register('quickPanel.recentwiki', ['app/data/quick-panel/recentwiki.json']);
    }
})();
