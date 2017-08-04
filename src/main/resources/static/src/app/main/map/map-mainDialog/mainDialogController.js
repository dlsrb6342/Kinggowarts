(function ()
{
    'use strict';

    angular
        .module('app.main.map')
        .controller('MainDialogController', MainDialogController);

    /** @ngInject */
    function MainDialogController(nMarkerTitleToKMarkerMappingObj, categoriesToKMarkerMappingObj, kMarkerStorageArr, kMarkersOnMap, CategoryMenuData, kMarkerData, $http, $httpParamSerializerJQLike, $mdDialog, $sessionStorage, $sce, $state, $rootScope, $scope)
    {
    	//object
    	function commKMarker(id, title, center, categoriesArr, region, tagsArr){
            this.id = id;           //id
            this.title = title;       //title TMP
            this.center = center;
            this.categoriesArr = categoriesArr;   //marker's category
            this.tagsArr = tagsArr;
            this.region = region;
        };

        //kMarker의 categoriesArr element들.
        function kMarkerCategoryObj(id, title){ 
            this.id = id;
            this.title = title;
        };
        kMarkerCategoryObj.prototype.getId = function() {
            return this.id;
        };
        kMarkerCategoryObj.prototype.getTitle = function(){
            return this.title;
        }
        kMarkerCategoryObj.prototype.setId = function(id) {
            this.id = id
        };
        kMarkerCategoryObj.prototype.setTitle = function(title){
            this.title = title;
        };


    	var vm = this;
    	
    	//JSON.parse(JSON.stringify(kMarkerData));

    	var resolvedKMarkerData = kMarkerData;
    	var kMarkerCategoriesArr = [];	//현재 kMarker의 카테고리 obj들

    	vm.kMarkerTitle = "";	//title
    	vm.categoryMenuData = CategoryMenuData;	//카테고리 트리 구조
    	vm.selectedCategories = [];	//표시할 seleceted categories
    	vm.wikiPath = '';
    	vm.bModifyMode = false;

    	//function
    	vm.printSelectedCategories = printSelectedCategories;
    	vm.init = init;
    	
    	//do stuff
    	vm.init();	//init

    	


    	vm.answer = function(answer) {
		if(answer == 'modifyInfo'){
			vm.bModifyMode = true;
		}
		else if(answer == 'modifyShape'){
			//modifyShape할 마커 정보 return
			$mdDialog.hide(
	                        {
	                        	'kMarker' : kMarkerData,
	                        	'respond' : 'modifyShape'
	                        }
                        );
		}
		else if(answer == 'save'){
			if(kMarkerCategoriesArr.length == 0){
				alert('카테고리가 1개 이상 필요합니다.');
			}
			else{
				//comm을 위한 commKMarker
				var forCommKMarker = new commKMarker(
					resolvedKMarkerData.getId(),
					vm.kMarkerTitle,		//changed
					{
						'lat' : resolvedKMarkerData.getPosition().lat,
						'lng' : resolvedKMarkerData.getPosition().lng
					},
					vm.selectedCategories,	//changed
					null,	//tagsArr	//changed
					null	//region
				);
				forCommKMarker.path = resolvedKMarkerData.getRegion();
				//putMarkerDetail(inData,kMarkerData, nMarkerTitleToKMarkerMappingObj, categoriesToKMarkerMappingObj);
			}
		}
		else if(answer == 'delete'){
			//성공시 deleteMarker()에서  $mdDialog.hide('delete') 호출됌.
			//deleteMarker(inData,kMarkerData, nMarkerTitleToKMarkerMappingObj, categoriesToKMarkerMappingObj, kMarkerStorageArr, kMarkersOnMap);		
		}
		else if(answer == 'return'){
			vm.init();
		}
		
	};


	vm.hide = function() {
		$mdDialog.hide();
	};
	vm.cancel = function() {
		$mdDialog.cancel();
	};
	
	vm.movewiki = function(){
		vm.cancel();
		$rootScope.wikipath = vm.wikiPath;
 
                if($state.includes('app.main.wiki') == true)
                {
                    $state.reload();
                }
                else
                {
                    $state.go('app.main.wiki');
                }
	};


	//선택한 카테고리 string 얻는 함수
	function printSelectedCategories() {
	        var numberOfCategories = vm.selectedCategories.length;
	        var ret = vm.selectedCategories[0];
	        if (numberOfCategories > 1) {
	        	for(var i=1; i<numberOfCategories; i++){
	        		ret = ret + ', ' + vm.selectedCategories[i];
	        	}
	        }
	        return ret;
      	};

      	function init(){
      		vm.kMarkerTitle = JSON.parse(JSON.stringify(resolvedKMarkerData.getTitle()));	//title
      		kMarkerCategoriesArr = JSON.parse(JSON.stringify(resolvedKMarkerData.getCategoriesArr()));
      		vm.selectedCategories = [];	//표시할 seleceted categories
	    	//카테고리의 title만 추가.
	    	for(var i=0 ,ii = kMarkerCategoriesArr.length; i<ii; i++){
	    		vm.selectedCategories.push(kMarkerCategoriesArr[i].title);
	    	}
	    	vm.wikiPath = '../xwiki/bin/view/XWiki/' + vm.kMarkerTitle;
    		vm.bModifyMode = false;
      	};

      	//http
      	function putMarkerDetailHttp(inData){
            var putid = inData["id"];
            delete inData["id"];
            return $http({
                method: 'PUT',
                //url: './api/map' + '/' + putid,
                data : JSON.stringify(inData),
                headers: {'x-auth-token': $sessionStorage.get('AuthToken'),
                        },
                transformResponse: [function (data) {
                    return data;
                }]
            });
        };
        function deleteMarkerHttp(inData){
            var delid = inData["id"];
            return $http({
                method: 'DELETE',
                url: './api/map' + '/' + delid,
                headers: {'x-auth-token': $sessionStorage.get('AuthToken') },
                transformResponse: [function (data) {
                    return data;
                }]
            });
        };

        //put process
        function putMarkerDetail(inData, kMarkerData, markerTitleToKMarkerMappingObj, categoriesToKMarkerMappingObj){
            //데이터 변경을 위한 statue 전환.
            var respo = putMarkerDetailHttp(inData);
            respo.then(
                function successFunc(response){
                    if(response.data == "duplicatedName"){
                        alert('중복된 이름입니다. 다른 이름을 설정하세요');
                    }
                    else if(response.data == "notAllowed"){
                        alert('notAllowed');
                    }
                    else if(response.data == "success"){
                        //TODO : success
                        //title, category, tags

                        //mapping 해제
                        delete markerTitleToKMarkerMappingObj[kMarkerData.getTitle()];
                        var tempKMarkerCategoriesArr = kMarkerData.getCategoriesArr();
                        for(var i = 0, ii = tempKMarkerCategoriesArr.length; i<ii; i++){
                        	var tempKMarkerInnerObjArr = categoriesToKMarkerMappingObj[tempKMarkerCategoriesArr[i].title].kMarker;
                        	for(var j =0 , jj = tempKMarkerInnerObjArr.length; j<jj; j++){
                        		if(tempKMarkerInnerObjArr[j] == kMarkerData){
                        		//if(tempKMarkerInnerObjArr[j].getTitle() == kMarkerData.getTitle())
                        			splice(tempKMarkerInnerObjArr(j,j));
                        			break;	//한개의 kMarker만 존재 할 것이므로
                        		}
                        	}
                        }

                        //modify kMarker with indata
                        kMarker.setTitle(inData.title);

                        var newTempKMarkerCategoriesArr = [];
                        for(var i = 0, ii = inData.categoriesArr.length; i<ii; i++){
                        	var inObj = new kMarkerCategoryObj(0, inData.categoriesArr[i].title);
                        	newTempKMarkerCategoriesArr.push(inObj);
                        }
                        kMarker.setCategoriesArr(newTempKMarkerCategoriesArr);
                        //kMarker.tag(inData.tagsArr)
                        

                        //mapping register
                        markerTitleToKMarkerMappingObj[kMarkerData.getTitle()] = kMarker;
                        for(var i = 0, ii = inData.categoriesArr.length; i<ii; i++){
                        	//categoriesToKMarkerMappingObj[inData.categoriesArr[i]] == innerMappingObj
                        	categoriesToKMarkerMappingObj[inData.categoriesArr[i]].getKMarkersArr().push(newKMarker);;
                        }

                        vm.init();	//init & return
                        

                    }
                    else if(response.data == "noLocation"){
                        alert('수정하려는 지역이 존재하지 않습니다.');
                        //TODO : need refresh
                    }
                    else{
                    	console.log("modifyMarkerDetail undefined response");
                    	console.log(response.data);
                    }
                    //console.log("asdf");
                },
                 function failFunc(response){
                    console.log(response);
                });
        };

        //커스텀 지역 내용 수정 Process.
        function deleteMarker(inData, kMarkerData, markerTitleToKMarkerMappingObj, categoriesToKMarkerMappingObj, kMarkerStorageArr, kMarkersOnMap){
            //데이터 변경을 위한 statue 전환.
            var respo = deleteMarkerHttp(inData);
            respo.then(
                function successFunc(response){
                    if(response.data == "noLocation"){
                        alert('수정하려는 지역이 존재하지 않습니다.');
                        refreshRegionData("regions");
                    }
                    else if(response.data == "notAllowed"){
                        alert('notAllowed');
                    }
                    else if(response.data == "success"){
                    	kMarkerData.unsetOnMap();	//nMarker Unset
                    	kMarkerData.unsetPolyOnMap();

                    	//kMarkerStorageArr, kMarkersOnMap delete
                    	for(var i = 0, ii = kMarkerStorageArr.length; i<ii; i++){
                    		//if(kMarkerStorageArr[j].getTitle() == kMarkerData.getTitle())
                    		if(kMarkerStorageArr[i] == kMarkerData){
                    			kMarkerStorageArr.splice(i,i);
                    			break;
                    		}
                    	}
                    	for(var i = 0, ii = kMarkersOnMap.length; i<ii; i++){
                    		//if(kMarkerStorageArr[j].getTitle() == kMarkerData.getTitle())
                    		if(kMarkersOnMap[i] == kMarkerData){
                    			kMarkersOnMap.splice(i,i);
                    			break;
                    		}
                    	}

                    	//mapping 해제
                        delete markerTitleToKMarkerMappingObj[kMarkerData.getTitle()];
                        var tempKMarkerCategoriesArr = kMarkerData.getCategoriesArr();
                        for(var i = 0, ii = tempKMarkerCategoriesArr.length; i<ii; i++){
                        	var tempKMarkerInnerObjArr = categoriesToKMarkerMappingObj[tempKMarkerCategoriesArr[i].title].kMarker;
                        	for(var j =0 , jj = tempKMarkerInnerObjArr.length; j<jj; j++){
                        		if(tempKMarkerInnerObjArr[j] == kMarkerData){
                        		//if(tempKMarkerInnerObjArr[j].getTitle() == kMarkerData.getTitle())
                        			tempKMarkerInnerObjArr.splice(j,j);
                        			break;	//한개의 kMarker만 존재 할 것이므로
                        		}
                        	}
                        }

                        $mdDialog.hide(
	                        {
	                        	'kMarker' : kMarkerData,
	                        	'respond' : 'delete'
	                        }
                        );
                    }
                },
                 function failFunc(response){
                    console.log(response);
                });
        };
    }
})();