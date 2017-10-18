(function ()
{
    'use strict';

    angular
        .module('app.main.map')
        .controller('MapSideController', MapSideController);

    /** @ngInject */
    function MapSideController(
        sideMapCommService,
        /*nMarkerTitleToKMarkerMappingObj, categoriesToKMarkerMappingObj, kMarkerStorageArr, kMarkersOnMap, CategoryMenuData, kMarkerData,*/ 
        $http, $httpParamSerializerJQLike, $mdDialog, $sessionStorage, $sce, $state, $rootScope, $scope, $timeout)
    {
    	
/*
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
*/

    	var vm = this;
    	
    	//JSON.parse(JSON.stringify(kMarkerData));
        var categoryMenuDataConstant = [
            {"name":"편의시설", "type":"Facilities", "icon" : "icon-emoticon-happy", "inner" : 
                [
                    {"name":"은행/ATM", "type":"ATM", "icon" : "icon-square-inc-cash"},
                    {"name":"휴게실", "type":"휴게실", "icon" : "icon-leaf"},
                    {"name":"정류장", "type":"정류장", "icon" : "icon-subway"},
                    {"name":"복사/제본", "type":"프린터", "icon" : "icon-printer"},
                    {"name":"편의점", "type":"편의점", "icon" : "icon-store"}
                ]
            },
            {"name":"음식점", "type":"Restaurant", "icon" : "icon-food-variant", "inner" : 
                [
                    {"name":"교내식당", "type":"교내식당", "icon" : "icon-food-apple"},
                    {"name":"교외식당", "type":"교외식당", "icon" : "icon-food-apple"},
                    {"name":"교내매점", "type":"교내매점", "icon" : "icon-pen"},
                    {"name":"카페", "type":"카페", "icon" : "icon-martini"}
                ]
            },
            
            
                    {"name":"구역", "type":"regions", "icon" : "icon-vector-square"},
                    {"name":"이벤트", "type":"customevent", "icon" : "icon-radio-tower"}
           
        ];

        vm.categoryMenuData = JSON.parse(JSON.stringify(categoryMenuDataConstant)); //카테고리 트리 구조
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
        vm.toggleWindowGuide = toggleWindowGuide;

        var sideBarWidthNumMin = 300;  //sideBar Width Min (최소 너비가 다음 값 이상)
        var sideBarWidthNum = 300;  //sideBar Width
        var sideBarHeightExceptIFrame = 180;

        var toggleOnOff = false;

        //window.setIFrameSize=setIFrameSize;

        //tab index watch : 선택 tab이 변경된 경우
        $scope.$watch(function(){return vm.tabIndex}, function(newValue, oldValue){
            vm.initWithIdx(newValue);
        }, true);

        $rootScope.$on('ToSide', vm.openSide);

    	//do stuff
        //vm.init();
    	vm.initWithIdx(0);	//init

    	vm.answer = function(answer) {
    		if(answer == 'gotoModify'){
    			vm.bModifyMode = true;
                vm.bSideOpen = true;
                $rootScope.$broadcast('ToMain', {
                    type : 'gotoModify',
                    kMarker : vm.resolvedKMarkerDataArr[vm.tabIndex]
                });
    		}
    		else if(answer == 'create'){
    			if(kMarkerCategoriesArr.length == 0){
    				alert('카테고리가 1개 이상 필요합니다.');
    			}
    			else{
    				//comm을 위한 commKMarker
    				var forCommKMarker = new commKMarker(
    					0, //id
    					vm.kMarkerTitle,		//changed
    					null,  //center
    					vm.selectedCategories,	//not categoryObj
    					vm.tagsCreate,	//tagsArr	//changed
    					null	//region
    				);
    				mapApiService.postMarkerDetail(forCommKMarker);
                    //disableAll();
    			}
    		}
            else if(answer == 'modify'){
                if(kMarkerCategoriesArr.length == 0){
                    alert('카테고리가 1개 이상 필요합니다.');
                }
                else{
                    //comm을 위한 commKMarker
                    var forCommKMarker = new commKMarker(
                        null,   //nMarker
                        0, //id
                        vm.kMarkerTitle,        //changed
                        null,
                        vm.selectedCategories,  //not categoryObj
                        vm.tagsModify,   //tagsArr   //changed
                        null    //region
                    );
                    //forCommKMarker.setTimeStampAuto();
                    mapApiService.putMarkerDetail(forCommKMarker, vm.resolvedKMarkerDataArr[vm.tabIndex]);
                    //disableAll();

                }
            }
    		else if(answer == 'delete'){
    			deleteMarkerDetail(vm.resolvedKMarkerDataArr[vm.tabIndex]);
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
            vm.categoryMenuData = JSON.parse(JSON.stringify(categoryMenuDataConstant)); //카테고리 트리 구조
            vm.selectedCategories.length = 0; //표시할 seleceted categories
            vm.wikiPath = '';
            vm.bModifyMode = false;
            vm.bSideOpen = false;
            toggleWindowGuideOff();
        }
        //tabs의 idx로 init 합니다.
      	function initWithIdx(idx){
            toggleWindowGuideOff();
            //console.log("vm.resolvedKMarkerDataArr");
            if(vm.resolvedKMarkerDataArr.length == 0){
                return;
            }

      		vm.kMarkerTitle = JSON.parse(JSON.stringify(vm.resolvedKMarkerDataArr[idx].getTitle()));	//title
      		kMarkerCategoriesArr = JSON.parse(JSON.stringify(vm.resolvedKMarkerDataArr[idx].getCategoriesArr()));
      		vm.selectedCategories.length = 0;	//표시할 seleceted categories
            vm.tags = angular.copy(vm.resolvedKMarkerDataArr[idx].getTagsArr());
            vm.tagsModify = angular.copy(vm.resolvedKMarkerDataArr[idx].getTagsArr());
            vm.tagsCreate = [];
	    	//카테고리의 title만 추가.
	    	for(var i=0 ,ii = kMarkerCategoriesArr.length; i<ii; i++){
	    		//vm.selectedCategories.push(kMarkerCategoriesArr[i].title);
                vm.selectedCategories.push(kMarkerCategoriesArr[i]);
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
            vm.tagsCreate = [];
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
            toggleWindowGuideOff();
            vm.bSideOpen = false;
        };

        //사이드 wiki 부분을 엽니다. $RootScope.$on ToSide function
        function openSide(event, args){
            if(args.type == "bOpen"){
                updateSideMapWidthSize();   //side map width 조절
                updateIFrameWidthSize();    //iframe 조절
                updateIFrameHeightSize();
                $rootScope.$broadcast('ToMain', {
                    type : 'bOpen',
                    bOpen : true,
                    arg : sideBarWidthNum
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
                    if(args.hasOwnProperty('idx')){
                        vm.initWithIdx(args.idx);
                    }
                    else{
                        vm.initWithIdx(0);  //init idx
                    }
                    //updateIFrameHeightSize();
                    //finally open
                    vm.bSideOpen = args.bOpen;

                    
                });
                
            }
            //단순 재오픈
            else if(args.type == 'reOpen'){
                updateSideMapWidthSize();   //side map width 조절
                updateIFrameWidthSize();    //iframe 조절
                updateIFrameHeightSize();
                $rootScope.$broadcast('ToMain', {
                    type : 'bOpen',
                    bOpen : true,
                    arg : sideBarWidthNum
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
                if(args.apiType == 'create'){
                    if(args.result == 'success'){
                        //do nothing
                    }
                    else if(args.result == 'fail'){
                    }   
                }
                else if(args.apiType == 'modify'){
                    if(args.result == 'success'){
                        //do nothing
                    }
                    else if(args.result == 'dup'){
                        //enable
                    }
                }
                else if(args.apiType == 'delete'){
                    if(args.result == 'success'){
                        var deletedKMarker = args.data;   //deleted
                        //vm.resolvedKMarkerDataArr[vm.tabIndex]를 delete.
                        if(vm.resolvedKMarkerDataArr.length == 1){
                            //close
                        }
                        for(var i=0; i< vm.resolvedKMarkerDataArr.length; i++){
                            if(vm.resolvedKMarkerDataArr[i] == deletedKMarker){
                                vm.resolvedKMarkerDataArr.splice(i, 1);
                            } 
                        }
                        if(vm.resolvedKMarkerDataArr.length != 0){
                            initWithIdx(0);
                        }
                        vm.bModifyMode = false;
                        vm.bCreateMode = false;
                    }
                    else if(args.result == 'dup'){

                    }
                }

                enableAll();    //end api. enable all.
            }
            else if(args.type == 'gotoCreate'){
                updateSideMapWidthSize();   //side map width 조절
                updateIFrameWidthSize();    //iframe 조절
                updateIFrameHeightSize();
                $rootScope.$broadcast('ToMain', {
                    type : 'bOpen',
                    bOpen : true,
                    arg : sideBarWidthNum
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

        //iFrame의 높이를 재조정한다.
        function updateIFrameHeightSize(){
            var windowHeight = window.innerHeight;
            windowHeight = windowHeight - sideBarHeightExceptIFrame;
            var iFrameHeightStr = "";
            iFrameHeightStr = iFrameHeightStr + windowHeight + "px";
            //document.getElementById("myIFrameWrapper").height = iFrameHeightStr;
            $("#myIFrameWrapper").css("height", iFrameHeightStr);    //change upper html div width
        };

        //SideBar & IFrame의 Width를 재설정한다.
        function setIFrameWidthSize(width){
            if(sideBarWidthNumMin > width){
                sideBarWidthNum = sideBarWidthNumMin;
                //console.log("set to(1st) : " + sideBarWidthNum);
                return sideBarWidthNum;
            }
            if($(window).width()-20 < width){
                sideBarWidthNum = $(window).width() -20;
                //console.log("set to(2st) : " + sideBarWidthNum);
                return sideBarWidthNum;
            }

            sideBarWidthNum = width;
            //console.log("set to(3st) : " + sideBarWidthNum);
            return sideBarWidthNum;
        };
        //Iframe의 너비를 재조정한다.
        function updateIFrameWidthSize(){
            var iFrameWidthStr = "";
            iFrameWidthStr = iFrameWidthStr + sideBarWidthNum + "px";
            //document.getElementById("myIFrameWrapper").width = iFrameWidthStr;
            $("#myIFrameWrapper").css("width", iFrameWidthStr);    //change upper html div width
        }
        //Side-bar의 너비를 재조정한다.
        function updateSideMapWidthSize(){
            var iFrameWidthStr = "";
            iFrameWidthStr = iFrameWidthStr + sideBarWidthNum + "px";
            $("#map-side").css("width", iFrameWidthStr);    //change upper html div width
            $("#dragBar").css("left", iFrameWidthStr);
            //document.getElementById("map-side").width = iFrameWidthStr;
        };

        function toggleWindowGuide(){
            if(toggleOnOff == false){
                toggleOnOff = true;
                $rootScope.$broadcast('ToMain', {
                    type : 'windowGuide',
                    bOnOff : toggleOnOff
                });
            }
            else{
                toggleOnOff = false;
                $rootScope.$broadcast('ToMain', {
                    type : 'windowGuide',
                    bOnOff : toggleOnOff
                });
            }
        };

        function toggleWindowGuideOff(){
            if(toggleOnOff == true){
                toggleOnOff = false;
                $rootScope.$broadcast('ToMain', {
                    type : 'windowGuide',
                    bOnOff : toggleOnOff
                });
            }
        };

        //창크기 변화 감지
        $(window).resize(function() {
            //var windowWidth = $(window).height();
            if($(window).height() < sideBarWidthNum){
                sideBarWidthNum = $(window).width() - 20;
            }
            updateSideMapWidthSize();
            updateIFrameWidthSize();
            updateIFrameHeightSize();
            $rootScope.$broadcast('ToMain', {
                type : 'windowResize',
                bOpen : vm.bSideOpen,
                arg : sideBarWidthNum
            }
            );
           
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

        //드래그 바 JQuery
        $( function() {
        $( '#dragBar' ).each( function() {
            var $drag = $( this );
            $drag.on( 'mousedown', function( ev ) {
                var $this = $( this );
                //var $parent = $this.parent();
                //var poffs = $parent.position();
                //var pwidth = $parent.width();
                
                var x = ev.pageX;
                var y = ev.pageY;
                var savedRx = 0;
                var tempSideBarWidthNum = sideBarWidthNum;
                //console.log("mouseDown");
                //$this.parent();
                    
                $( document ).on( 'mousemove.dragging', function( ev ) {
                    var mx = ev.pageX;
                    var my = ev.pageY;
                    
                    var rx = mx - x;
                    var ry = my - y;
                    //console.log("mouseDraging");
                    if(tempSideBarWidthNum + rx < 300 || mx < 300){
                        tempSideBarWidthNum = 300;
                    }
                    else{
                        $this.css( {
                        'left' : (tempSideBarWidthNum + rx) + 'px'
                        } );
                    //savedRx = rx;

                    setIFrameWidthSize(tempSideBarWidthNum + rx);
                    updateSideMapWidthSize();
                    updateIFrameWidthSize();
                    updateIFrameHeightSize();
                    $rootScope.$broadcast('ToMain', {
                        type : 'windowResize',
                        bOpen : vm.bSideOpen,
                        arg : sideBarWidthNum
                    }
                    );


                    }                    
                } ).on( 'mouseup.dragging mouseleave.dragging', function( ev) {
                    $( document ).off( '.dragging' );
                    var $this = $( this );
/*
                    tempSideBarWidthNum = setIFrameWidthSize(tempSideBarWidthNum + savedRx);
                    updateSideMapWidthSize();
                    updateIFrameWidthSize();
                    updateIFrameHeightSize();
                    $this.css( {
                        'left' : tempSideBarWidthNum + 'px'
                    } );
                    $rootScope.$broadcast('ToMain', {
                        type : 'windowResize',
                        bOpen : vm.bSideOpen,
                        arg : sideBarWidthNum
                    }
                    );
                    */
                    //console.log("leave dragging");
                } );
                
                
            } );
            
        } );
    });
    


    }
})();