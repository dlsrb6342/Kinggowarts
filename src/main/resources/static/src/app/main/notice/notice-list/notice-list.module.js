(function ()
{
    'use strict';

    angular
        .module('app.notice.list',
            [
                // 3rd Party Dependencies
                'datatables',
                'app.notice.list.item'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider
            .state('app.notice.list', {
                url    : '/:title',
                views  : {
                    'notice-list@app.notice': {
                        templateUrl: 'app/main/notice/notice-list/notice-list.html',
                        controller : 'NoticeListController as vm'
                    }
                },
                resolve: {
                    NoticeListData: function ($http, $sessionStorage, $stateParams)
                    {   
                        var titleParam;
                        // state parameter에 따라 실제 db의 category 이름을 매칭한다.
                        switch($stateParams.title){
                            case 'skku' :
                                titleParam = 'skku';
                                break;
                            case 'facebook' :
                                titleParam = 'fb';
                                break;
                            case 'computer-science' :
                                titleParam = 'cs';
                                break;
                            default :
                                titleParam = 'skku';
                                break;
                        }
                        // token을 포함하여 각 category의 titleParam에 대한 GET request를 보낸다.
                        var obj = $http({
                            method : 'GET',
                            url : './api/notice?all=true&category=' + titleParam,
                            headers: {'x-auth-token' : $sessionStorage.get('AuthToken')}
                        })
                        return obj;
                    }
                }
            });

        
        // Navigation
        msNavigationServiceProvider.saveItem('notice.skku', {
            title : '성균관대학교',
            icon  : 'icon-school',
            state : 'app.notice.list',
            stateParams: 
              {
                title  : 'skku'
              },
            weight: 3
        });

        msNavigationServiceProvider.saveItem('notice.facebook', {
            title : 'Facebook',
            icon  : 'icon-facebook-box',
            state : 'app.notice.list',
            stateParams: 
              {
                title  : 'facebook'
              },
            weight: 3
        });

        msNavigationServiceProvider.saveItem('notice.computer-science', {
            title : '소프트웨어대학',
            icon  : 'icon-school',
            state : 'app.notice.list',
            stateParams: 
              {
                title  : 'computer-science'
              },
            weight: 3
        });
       
    }
})();