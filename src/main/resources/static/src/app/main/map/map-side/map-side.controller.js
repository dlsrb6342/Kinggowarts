(function ()
{
    'use strict';

    angular
        .module('app.main.map')
        .controller('MapSideController', MapSideController);

    /** @ngInject */
    function MapSideController(
        sideMapCommService, mapApiService,
        /*nMarkerTitleToKMarkerMappingObj, categoriesToKMarkerMappingObj, kMarkerStorageArr, kMarkersOnMap, CategoryMenuData, kMarkerData,*/ 
        $http, $httpParamSerializerJQLike, $mdDialog, $sessionStorage, $sce, $state, $rootScope, $scope, $timeout)
    {
    	//object
        function commKMarker(id, title, center, categoriesArr, region, tagsArr, detail, campusType){
            this.id = id;           //id
            this.title = title;       //title TMP
            this.center = center;       //naver latlng : {_lat, _lng}
            this.categoriesArr = categoriesArr;   //marker's Category : ["catname"]
            this.tagsArr = tagsArr;     // : ["tag1", "tag2, .."]
            this.region = region;       // naver latlng arr : [{_lat, _lng}, {_lat, _lng}, {_lat, _lng}... ]
            this.detail = detail;
            this.campusType = campusType;
        };
        commKMarker.prototype.setRegion = function(region){
            this.region = region;
        };
        commKMarker.prototype.setTagsArr = function(tagsArr){
            this.tagsArr = tagsArr;
        };
        commKMarker.prototype.makeCommAPIMarker = function(){
            var retCommAPIMarker = new commAPIMarker(
                this.id,
                this.title,
                {"lat" : this.center._lat, "lng" : this.center._lng},
                {"name" : this.categoriesArr[0], "type" : this.campusType},
                [],   //path
                [],   //tags
                this.detail,
                "user"  //default
            );
            if(this.region != null && this.region.length != 0){
                var tempPath = [];
                for(var i=0, ii = this.region.length; i<ii; i++){
                    tempPath.push({"lat" : this.region[i]._lat, "lng" : this.region[i]._lng});
                }
                retCommAPIMarker.setPath(tempPath);
            }
            if(this.tagsArr != null && this.tagsArr.length != 0){
                var tempTags = [];
                for(var i=0, ii = this.tagsArr.length; i<ii; i++){
                    tempTags.push({"name" : this.tagsArr[i]});
                }
                retCommAPIMarker.setTags(tempTags);
            }
            return retCommAPIMarker;
        };

        function commAPIMarker(id, name, center, markerCategory, path, tags, detail, type){
            this.id = id;           //id
            this.name = name;       //title TMP
            this.center = center;       //latlng : {lat, lng}
            this.detail = "";
            this.markerCategory = markerCategory;   //marker's Category : [{"name" : "catname", "type" : "M or Y"}]
            this.tags = tags;     // : [{"name : tag1"}, {"name" : tag2}, .."]
            this.path = path;       // polygon path : [{lat, lng}, {lat, lng}, {lat, lng}... ]
            this.detail = detail;
            this.type = type; //default user value
        };
        commAPIMarker.prototype.setTags = function(tags){
            this.tags = tags;
        };
        commAPIMarker.prototype.setPath = function(path){
            this.path = path;
        };
        commAPIMarker.prototype.makeCommKMarker = function(){
            var retCommKMarker = new commKMarker(
                this.id,
                this.name,
                this.center = new naver.maps.LatLng(this.center.lat, this.center.lng),
                [this.markerCategory.name],   //category
                null,   //region
                [],    //tags
                this.detail,
                this.markerCategory.type
            );
            if(this.path != null && this.path.length != 0){
                var tempRegion = [];
                for(var i=0, ii = this.path.length; i<ii; i++){
                    tempRegion.push(new naver.maps.LatLng(this.path[i].lat, this.path[i].lng));
                }
                retCommKMarker.setRegion(tempRegion);
            }
            if(this.tags != null && this.tags.length != 0){
                var tempTagsArr = [];
                for(var i=0, ii = this.tags.length; i<ii; i++){
                    tempTagsArr.push(this.tags[i].name);
                }
                retCommKMarker.setTagsArr(tempTagsArr);
            }
            return retCommKMarker;
        };

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
            {"name":"교내시설", "type":"교내시설", "icon" : "icon-vector-square"}
           
        ];
        var campusData = [
            {"name" : "명륜", "type" : "M"},
            {"name" : "율전", "type" : "Y"}
        ];


        vm.categoryMenuData = JSON.parse(JSON.stringify(categoryMenuDataConstant)); //카테고리 트리 구조
    	vm.resolvedKMarkerDataArr = sideMapCommService.kMarkerResolvedArr; //service로 온 선택된 kMarkers.
        vm.resolvedKMarkerDataArrTitles = [];                               //tabs의 title로 표시할 kMarkers Title

        vm.campusData = campusData;
        vm.kMarkerDetail = "";
        vm.selectedCampus = "Y";
    	
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
            //console.log(JSON.parse(JSON.stringify(vm.selectedCategories)));
    		if(answer == 'gotoModify'){
    			vm.bModifyMode = true;
                vm.bSideOpen = true;
                $rootScope.$broadcast('ToMain', {
                    type : 'gotoModify',
                    kMarker : vm.resolvedKMarkerDataArr[vm.tabIndex]
                });
    		}
    		else if(answer == 'create'){
    			if(vm.selectedCategories == null){
    				alert('카테고리가 필요합니다.');
    			}
    			else{
    				//comm을 위한 commKMarker
                    //console.log(vm.selectedCampus);
    				var forCommKMarker = new commKMarker(
    					0, //id
    					JSON.parse(JSON.stringify(vm.kMarkerTitle)),		//changed
    					null,  //center
    					JSON.parse(JSON.stringify(vm.selectedCategories)),	//not categoryObj
                        null,    //region
    					JSON.parse(JSON.stringify(vm.tagsCreate)),	//tagsArr	//changed
                        vm.kMarkerDetail,     //detail
                        vm.selectedCampus     //campusTy
    				);
    				mapApiService.postMarkerDetail(forCommKMarker);
                    //disableAll();
    			}
    		}
            else if(answer == 'modify'){
                if(vm.selectedCategories == null){
                    alert('카테고리가 필요합니다.');
                }
                else{
                    //console.log(vm.selectedCampus);
                    //comm을 위한 commKMarker
                    var forCommKMarker = new commKMarker(
                        vm.resolvedKMarkerDataArr[vm.tabIndex].id, //id
                        JSON.parse(JSON.stringify(vm.kMarkerTitle)),        //changed
                        null,       //center
                        JSON.parse(JSON.stringify(vm.selectedCategories)),  //not categoryObj
                        null,       //region
                        JSON.parse(JSON.stringify(vm.tagsModify)),   //tagsArr   //changed
                        vm.kMarkerDetail,     //detail
                        vm.selectedCampus     //campusTy
                    );
                    //forCommKMarker.setTimeStampAuto();
                    mapApiService.putMarkerDetail(forCommKMarker, vm.resolvedKMarkerDataArr[vm.tabIndex]);
                    //disableAll();

                }
            }
    		else if(answer == 'delete'){
    			mapApiService.deleteMarkerDetail(vm.resolvedKMarkerDataArr[vm.tabIndex]);
                //disableAll();		                
    		}
    		else if(answer == 'return'){
                //vm.initWithIdx(vm.tabIndex);
                if(vm.bModifyMode == true){
                    vm.bModifyMode = false;
                        $rootScope.$broadcast('ToMain', {
                            type : 'cancelModify',
                    });
                    $rootScope.$broadcast('ToMain', {
                        type : 'selectKMarker',
                        kMarker : null
                    });
                    closeSide();
                }
                else if(vm.bCreateMode == true){
                    vm.bCreateMode = false;
                    $rootScope.$broadcast('ToMain', {
                        type : 'cancelCreate',
                    });
                    $rootScope.$broadcast('ToMain', {
                        type : 'selectKMarker',
                        kMarker : null
                    });
                    closeSide();
                }
    		}
            else if(answer == 'cancel'){
                //vm.bSideOpen = false;
                closeSide();
                $rootScope.$broadcast('ToMain', {
                    type : 'selectKMarker',
                    kMarker : null
                });
            }
            else if(answer == 'backSpace'){
                if(vm.bModifyMode == true){
                    vm.bModifyMode = false;
                    $rootScope.$broadcast('ToMain', {
                        type : 'cancelModify',
                    });
                }
                vm.bCreateMode = false;
                $rootScope.$broadcast('ToMain', {
                    type : 'changeKMarkerColorBack',
                    kMarker : vm.resolvedKMarkerDataArr[vm.tabIndex]
                });
                refreshMofifyInfoWithTabIndex();

                //closeSide();
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
            vm.selectedCategories = []; //표시할 seleceted categories
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
      		vm.selectedCategories = [];	//표시할 seleceted categories
            vm.tags = angular.copy(vm.resolvedKMarkerDataArr[idx].getTagsArr());
            vm.tagsModify = angular.copy(vm.resolvedKMarkerDataArr[idx].getTagsArr());
            vm.tagsCreate = [];
            vm.kMarkerDetail = vm.resolvedKMarkerDataArr[idx].getDetail();
            vm.selectedCampus = vm.resolvedKMarkerDataArr[idx].getCampusType();
	    	//카테고리의 title만 추가.
	    	for(var i=0 ,ii = kMarkerCategoriesArr.length; i<ii; i++){
	    		//vm.selectedCategories.push(kMarkerCategoriesArr[i].title);
                vm.selectedCategories.push(kMarkerCategoriesArr[i]);
	    	}
	    	vm.wikiPath = '../xwiki/bin/view/XWiki/' + vm.kMarkerTitle;
            document.getElementById('myIFrame').src = vm.wikiPath;
    		vm.bModifyMode = false;

            //선택된 kMarker 전달 //set selectedKMarker in map.constroller
            $rootScope.$broadcast('ToMain', {
                type : 'selectKMarker',
                kMarker : vm.resolvedKMarkerDataArr[idx]
            });
      	};

        function refreshMofifyInfoWithTabIndex(){
            vm.kMarkerTitle = JSON.parse(JSON.stringify(vm.resolvedKMarkerDataArr[vm.tabIndex].getTitle()));    //title
            kMarkerCategoriesArr = JSON.parse(JSON.stringify(vm.resolvedKMarkerDataArr[vm.tabIndex].getCategoriesArr()));
            vm.kMarkerDetail = vm.resolvedKMarkerDataArr[vm.tabIndex].getDetail();
            vm.selectedCampus = vm.resolvedKMarkerDataArr[vm.tabIndex].getCampusType();
            vm.selectedCategories = [];   //표시할 seleceted categories
            vm.tags = angular.copy(vm.resolvedKMarkerDataArr[vm.tabIndex].getTagsArr());
            vm.tagsModify = angular.copy(vm.resolvedKMarkerDataArr[vm.tabIndex].getTagsArr());
            vm.tagsCreate = [];
            //카테고리의 title만 추가.
            for(var i=0 ,ii = kMarkerCategoriesArr.length; i<ii; i++){
                //vm.selectedCategories.push(kMarkerCategoriesArr[i].title);
                vm.selectedCategories.push(kMarkerCategoriesArr[i]);
            }
        };

        //새로운 마커생성을 위한 init
        function initWithCreate(campusType){
            vm.kMarkerTitle = "";    //title
            kMarkerCategoriesArr = [];
            vm.selectedCategories = [];   //표시할 seleceted categories
            vm.tagsCreate = [];
            vm.kMarkerDetail = "";
            vm.selectedCampus = campusType;
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
                vm.bModifyMode = false;
                vm.bCreateMode = false;
                updateSideMapWidthSize();   //side map width 조절
                updateIFrameWidthSize();    //iframe 조절
                updateIFrameHeightSize();
                $rootScope.$broadcast('ToMain', {
                    type : 'bOpen',
                    bOpen : true,
                    arg : sideBarWidthNum
                });

                //$scope.$apply(function() {
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

                    
                //});
                
            }
            //단순 재오픈
            else if(args.type == 'reOpen'){
                vm.bModifyMode = false;
                vm.bCreateMode = false;
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
                        //open new marker
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
                        for(var i=0; i< vm.resolvedKMarkerDataArr.length; i++){
                            if(vm.resolvedKMarkerDataArr[i] == deletedKMarker){
                                vm.resolvedKMarkerDataArr.splice(i, 1);
                                vm.resolvedKMarkerDataArrTitles.splice(i, 1);
                            } 
                        }
                        //console.log(vm.resolvedKMarkerDataArr);
                        if(vm.resolvedKMarkerDataArr.length != 0){
                            //vm.init();
                            //vm.initWithIdx(0);
                            vm.tabIndex = 0;
                        }
                        else{
                            closeSide();
                        }
                        vm.bModifyMode = false;
                        vm.bCreateMode = false;
                        //vm.bSideOpen = true;



/*
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
                        vm.bSideOpen = args.bOpen;
                        */

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

                    vm.initWithCreate(args.campusType);  //init idx
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