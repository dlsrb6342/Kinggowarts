(function ()
{
    'use strict';

    angular
        .module('app.main.map')
        .controller('MapSideController', MapSideController);

    /** @ngInject */
    function MapSideController(
        sideMapCommService,
        CategoryMenuData,
        /*nMarkerTitleToKMarkerMappingObj, categoriesToKMarkerMappingObj, kMarkerStorageArr, kMarkersOnMap, CategoryMenuData, kMarkerData,*/ 
        $http, $httpParamSerializerJQLike, $mdDialog, $sessionStorage, $sce, $state, $rootScope, $scope, $timeout)
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
        vm.categoryMenuData = CategoryMenuData.data; //카테고리 트리 구조
    	vm.resolvedKMarkerDataArr = sideMapCommService.kMarkerResolvedArr; //service로 온 선택된 kMarkers.
        vm.resolvedKMarkerDataArrTitles = [];                               //tabs의 title로 표시할 kMarkers Title
    	
        vm.tabIndex = 0;        //index
    	
        //modify 상태
        vm.kMarkerTitle = "";	//title
    	vm.selectedCategories = [];	//string으로 표시할 seleceted categories
        var kMarkerCategoriesArr = [];                                      //modify에서 새로 선택한 kMarker의 카테고리 obj들

    	vm.wikiPath = '';
    	vm.bModifyMode = false;
        vm.bCreateMode = false;
        vm.bSideOpen = false;

    	//function
    	vm.printSelectedCategories = printSelectedCategories;
    	vm.init = init;
        vm.initWithIdx = initWithIdx;
        vm.openSide = openSide;
        vm.initWithCreate = initWithCreate;

        window.setIFrameSize=setIFrameSize;

        //tab index watch
        $scope.$watch(function(){return vm.tabIndex}, function(newValue, oldValue){
            vm.initWithIdx(newValue);
        }, true);

        $rootScope.$on('ToSide', vm.openSide);

    	//do stuff
        //vm.init();
    	vm.initWithIdx(0);	//init

    	vm.answer = function(answer) {
    		if(answer == 'modifyInfo'){
    			vm.bModifyMode = true;
    		}
    		else if(answer == 'modifyShape'){
    			//modifyShape할 마커 정보 vm.resolvedKMarkerDataArr[vm.tabIndex] return
                vm.bSideOpen = false;
    			$rootScope.$broadcast('ToMain', {
                    type : 'modifyShape',
                    kMarker : vm.resolvedKMarkerDataArr[vm.tabIndex]
                });
    		}
    		else if(answer == 'save'){
    			if(kMarkerCategoriesArr.length == 0){
    				alert('카테고리가 1개 이상 필요합니다.');
    			}
    			else{
    				//comm을 위한 commKMarker
    				var forCommKMarker = new commKMarker(
    					vm.resolvedKMarkerDataArr[vm.tabIndex].getId(),
    					vm.kMarkerTitle,		//changed
    					{
    						'lat' : vm.resolvedKMarkerDataArr[vm.tabIndex].getPosition().lat,
    						'lng' : vm.resolvedKMarkerDataArr[vm.tabIndex].getPosition().lng
    					},
    					vm.selectedCategories,	//changed
    					null,	//tagsArr	//changed
    					null	//region
    				);
    				forCommKMarker.path = vm.resolvedKMarkerDataArr[vm.tabIndex].getRegion();
                    /*
                    $rootScope.$broadcast('ToMain', {
                            type : 'put',
                            bOpen : false
                    });
                    */
    				//mapApiService.putMarkerDetail(forCommKMarker, vm.resolvedKMarkerDataArr[vm.tabIndex]);
                    //disableAll();

    			}
    		}
    		else if(answer == 'delete'){
                var forCommKMarker = new commKMarker(
                        vm.resolvedKMarkerDataArr[vm.tabIndex].getId(),
                        vm.kMarkerTitle,        //useless
                        {
                            'lat' : vm.resolvedKMarkerDataArr[vm.tabIndex].getPosition().lat, //useless
                            'lng' : vm.resolvedKMarkerDataArr[vm.tabIndex].getPosition().lng //useless
                        },
                        vm.selectedCategories,  //useless
                        null,   //tagsArr   //useless
                        null    //region //useless
                    );
                forCommKMarker.path = vm.resolvedKMarkerDataArr[vm.tabIndex].getRegion(); //useless
                /*
                    $rootScope.$broadcast('ToMain', {
                            type : 'delete',
                            bOpen : false
                    });
                */
    			//deleteMarker(forCommKMarker, vm.resolvedKMarkerDataArr[vm.tabIndex]);
                //disableAll();		

                
    		}
    		else if(answer == 'return'){
                //vm.initWithIdx(vm.tabIndex);
                if(vm.bModifyMode == true){
                    vm.bModifyMode = false;
                }
                else if(vm.bCreateMode == true){
                    vm.bCreateMode = false;
                    $rootScope.$broadcast('ToMain', {
                        type : 'cancelCreate',
                    });
                    closeSide();
                }
    		}
            else if(answer == 'cancel'){
                //vm.bSideOpen = false;
            
                closeSide();
            }
    		
    	};


    	vm.hide = function() {
    		//$mdDialog.hide();
    	};
    	vm.cancel = function() {
    		//$mdDialog.cancel();
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

        //초기화
        function init(){
            vm.resolvedKMarkerDataArr = sideMapCommService.kMarkerResolvedArr; //*********TODO
            vm.resolvedKMarkerDataArrTitles.length = 0;
            kMarkerCategoriesArr.length = 0;  //현재 kMarker의 카테고리 obj들
            vm.tabIndex = 0;
            vm.kMarkerTitle = "";   //title
            vm.categoryMenuData = CategoryMenuData.data; //카테고리 트리 구조
            vm.selectedCategories.length = 0; //표시할 seleceted categories
            vm.wikiPath = '';
            vm.bModifyMode = false;
            vm.bSideOpen = false;
        }
        //tabs의 idx로 init 합니다.
      	function initWithIdx(idx){
            //console.log("vm.resolvedKMarkerDataArr");
            if(vm.resolvedKMarkerDataArr.length == 0){
                return;
            }

      		vm.kMarkerTitle = JSON.parse(JSON.stringify(vm.resolvedKMarkerDataArr[idx].getTitle()));	//title
      		kMarkerCategoriesArr = JSON.parse(JSON.stringify(vm.resolvedKMarkerDataArr[idx].getCategoriesArr()));
      		vm.selectedCategories.length = 0;	//표시할 seleceted categories
	    	//카테고리의 title만 추가.
	    	for(var i=0 ,ii = kMarkerCategoriesArr.length; i<ii; i++){
	    		vm.selectedCategories.push(kMarkerCategoriesArr[i].title);
	    	}
	    	vm.wikiPath = '../xwiki/bin/view/XWiki/' + vm.kMarkerTitle;
            document.getElementById('myIFrame').src = vm.wikiPath;
    		vm.bModifyMode = false;
      	};

        //새로운 마커생성을 위한 init
        function initWithCreate(){
            vm.kMarkerTitle = "이름없음";    //title
            kMarkerCategoriesArr = [];
            vm.selectedCategories.length = 0;   //표시할 seleceted categories
        };

        //response를 위한 disable
        function disableAll(){

        };

        function enableAll(){

        };
      	
        //사이드 wiki 부분을 닫습니다.
        function closeSide(){
            $rootScope.$broadcast('ToMain', {
                    type : 'bOpen',
                    bOpen : false
            });
            vm.bSideOpen = false;
        };

        //사이드 wiki 부분을 엽니다.
        function openSide(event, args){
            if(args.type == "bOpen"){
                $rootScope.$broadcast('ToMain', {
                    type : 'bOpen',
                    bOpen : true
                });

                $scope.$apply(function() {
                    vm.init();  //init all
                    vm.resolvedKMarkerDataArrTitles.length = 0;
                    vm.resolvedKMarkerDataArr = sideMapCommService.kMarkerResolvedArr;
                    
                    if(vm.resolvedKMarkerDataArr.length == 0){
                        vm.bSideOpen = false;
                        return;
                    }
                    //vm.tabIndex = 0;
                    if(vm.resolvedKMarkerDataArr.length != 0){
                        for(var i = 0, ii = vm.resolvedKMarkerDataArr.length; i<ii; i++){
                            vm.resolvedKMarkerDataArrTitles.push(vm.resolvedKMarkerDataArr[i].getTitle());
                            //console.log(vm.resolvedKMarkerDataArr[i].getTitle());
                        }
                    }

                    vm.initWithIdx(0);  //init idx
                    setIFrameSize();
                    //finally open
                    vm.bSideOpen = args.bOpen;

                    
                });
                
            }
            //단순 재오픈
            else if(args.type == 'reOpen'){
                $rootScope.$broadcast('ToMain', {
                    type : 'bOpen',
                    bOpen : true
                });
                $scope.$apply(function() {
                    if(vm.resolvedKMarkerDataArr.length == 0){
                        vm.bSideOpen = false;
                        return;
                    }
                    $rootScope.$broadcast('ToMain', {
                        type : 'bOpen',
                        bOpen : true
                    });
                    //finally open
                    vm.bSideOpen = args.bOpen;
                });
            }
            else if(args.type == 'api'){
                if(args.apiType == 'put'){
                    if(args.apiResult == 'success'){
                        //0--------------------------------------
                        //vm.init();  //init & return
                        //modify kMarker with indata
                        //kMarker.setTitle(inData.title);
                        var newTempKMarkerCategoriesArr = [];
                        for(var i = 0, ii = inData.categoriesArr.length; i<ii; i++){
                            var inObj = new kMarkerCategoryObj(0, inData.categoriesArr[i].title);
                            newTempKMarkerCategoriesArr.push(inObj);
                        }
                        kMarker.setCategoriesArr(newTempKMarkerCategoriesArr);
                        //kMarker.tag(inData.tagsArr)
                    }
                    else if(args.apiResult == 'dup'){

                    }
                }
                
                else if(args.apiType == 'delete'){
                    if(args.apiResult == 'success'){
                        //vm.resolvedKMarkerDataArr[vm.tabIndex]를 delete.
                    }
                    else if(args.apiResult == 'dup'){

                    }
                }

                enableAll();    //end api. enable all.
            }
            else if(args.type == 'create'){
                $rootScope.$broadcast('ToMain', {
                    type : 'bOpen',
                    bOpen : true
                });
                
                $scope.safeApply(function() {
                    vm.init();  //init all
                    vm.resolvedKMarkerDataArrTitles.length = 0;
                    vm.resolvedKMarkerDataArr.length = 0;
                    vm.resolvedKMarkerDataArrTitles.push("신규마커생성");

                    vm.initWithCreate();  //init idx
                    vm.bCreateMode = true;
                    //finally open
                    vm.bSideOpen = true;                    
                });
                
            }
        };

        function setIFrameSize(){
            var windowHeight = window.innerHeight;
            windowHeight = windowHeight - 164;
            var iFrameHeightStr = "";
            iFrameHeightStr = iFrameHeightStr + windowHeight + "px";
            document.getElementById("myIFrame").height = iFrameHeightStr;
        };

        //창크기 변화 감지
        $(window).resize(function() {
            //var windowWidth = $(window).height();
            setIFrameSize();
           
        });
        
        $scope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
                if(phase == '$apply' || phase == '$digest') {
                    if(fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };
        }
})();