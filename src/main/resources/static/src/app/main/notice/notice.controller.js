(function ()
{
    'use strict';

    angular
        .module('app.main.notice')
        .controller('NoticeController', NoticeController);

    /** @ngInject */
    function NoticeController(NoticeCategoryData, $scope, msNavigationService)
    {
    	var vm = this;

    	// module의 config에서는 data resolve가 안되므로 여기서 notice category의 navigation을 달아줌.
    	for (var i in NoticeCategoryData.data){
    		// Navigation
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
