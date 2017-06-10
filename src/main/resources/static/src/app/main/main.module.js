(function ()
{
    'use strict';

    angular
        .module('app.main', [

            // Toolbar
            'app.main.toolbar',

            // Quick Panel
            'app.main.quick-panel',

            //daum map module
            'app.main.map',

            //wiki module
            'app.main.wiki',

            //notice module
            'app.main.notice',

            ])
        .config(config);

    /** @ngInject */
    function config($stateProvider)
    {
        $stateProvider
            .state('app.main', {
                abstract: true,
                views   : {
                    'main@'         : {
                        templateUrl: 'app/main/main.html',
                        controller : 'MainController as vm'
                    },
                    'toolbar@app.main'   : {
                        templateUrl: 'app/main/toolbar/layouts/toolbar.html',
                        controller : 'ToolbarController as vm'
                    },
                    'quickPanel@app.main': {
                        templateUrl: 'app/main/quick-panel/quick-panel.html',
                        controller : 'QuickPanelController as vm'
                    }
                },
                resolve: {
                    PeerData: function ($http, $sessionStorage)
                    {

                        var obj = $http.get('./api/member/peer', {
                            headers : {'x-auth-token' : $sessionStorage.get('AuthToken')}
                        });
                        return obj
                    },
                    RequestData: function ($http, $sessionStorage)
                    {
                        var obj = $http.get('./api/member/reqPeerToMe', {
                            headers : {'x-auth-token' : $sessionStorage.get('AuthToken')}
                        });
                        return obj
                    },                 
                    RecentwikiData: function ($http)
                    {
                        var obj;
                        obj = $http.get('../xwiki/rest/wikis/xwiki/query?q=where++(doc.hidden+<>+true+or+doc.hidden+is+null)+and+doc.fullName+not+in+(select+doc.fullName+from+XWikiDocument+doc%2c+BaseObject+obj+where+obj.name+%3d+doc.fullName+and+obj.className+%3d+%27XWiki.XWikiUsers%27)+and+(doc.space+like+%27XWiki%27+or+doc.space+like+%27XWiki.%25%27)++order+by+doc.date+desc&type=hql&start=0&number=23');
                        return obj;
                    },
                    TimelineData: function ($http, $sessionStorage, $q, NoticeCategoryData)
                    {
                        var notice_category = NoticeCategoryData.data;
                        
                        var request_array = [];
                        for(var i in notice_category){
                            var notice_request= $http({
                                method : 'GET',
                                url : './api/notice?all=false&category=' + notice_category[i].name + '&size=10&page=0',
                                headers: {'x-auth-token' : $sessionStorage.get('AuthToken')}
                            })
                            request_array[i] = notice_request;
                        }

                        var obj = $q.all(request_array);

                        return obj;
                    }
                }
            });
    }
})();