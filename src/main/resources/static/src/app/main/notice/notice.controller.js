/*****************************************************************************

Copyright (c) 2017, kinggowarts team. All Rights Reserved.

*****************************************************************************/

/******************************************************
*  Document   : src/app/main/notice/notice.controller.js
*  Author     : underkoo
*  Description: notice 전체 컨트롤러
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.main.notice')
        .controller('NoticeController', NoticeController);

    /** @ngInject */
    function NoticeController(
        /* 데이터 */
        NoticeCategoryData, 

        /* 모듈 */
        $scope, 

        /* 서비스 */
        msNavigationService)
    {
        /* Data */
    	var vm = this;

    	/* module의 config에서는 data resolve가 안되므로 여기서 notice category의 navigation을 달아줌. */
    	for (var i in NoticeCategoryData.data){
            
    		msNavigationService.saveItem('notice.' + NoticeCategoryData.data[i].name, {
    		    title : NoticeCategoryData.data[i].korean_name,
    		    icon  : 'icon-school',
    		    state : 'app.main.notice.list',
    		    stateParams: 
    		      {
    		        category  : NoticeCategoryData.data[i].name
    		      },
    		    weight: i
    		});
    	}
    	
    }
})();
