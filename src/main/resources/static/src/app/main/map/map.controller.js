
(function ()
{
    'use strict';


    angular
        .module('app.main.map')
        .controller('MapController', MapController);


    /** @ngInject */
    function MapController(
        //data
        MarkerData,
        /*
        MBusstop,
        MShelter,
        MMarket,
        MPrinter,
        MCafe,
        MInEat,
        MInRest,
        MOutRest,
        MATM,
        */
        CategoryTypes,
        //AreaAdmin,
        DrawingMenuData,
        //CustomEventData,
        CategoryMenuData,

        //module
        $mdDialog,
        $rootScope,
        $q,
        $http,
        $httpParamSerializerJQLike,
        $scope,
        $interval,
        $timeout,
        $sessionStorage,
        $state,

        //service
        peerLocation,
        mapLocation,
        sideMapCommService
    )
    {
//object
        function categoriesToKMarkerMappingInnerObj(kMarkersArr, TF, id){
            this.kMarkersArr = kMarkersArr;
            this.TF = TF;
            this.id = id;
        }
        categoriesToKMarkerMappingInnerObj.prototype.getKMarkersArr = function() {
            return this.kMarkersArr;
        };
        categoriesToKMarkerMappingInnerObj.prototype.getTF = function() {
            return this.TF;
        };
        categoriesToKMarkerMappingInnerObj.prototype.getId = function() {
            return this.Id;
        };
        categoriesToKMarkerMappingInnerObj.prototype.setKMarkersArr = function(kMarkersArr) {
            this.kMarkersArr = kMarkersArr;
        };
        categoriesToKMarkerMappingInnerObj.prototype.setTF = function(TF) {
            this.TF = TF;
        };
        categoriesToKMarkerMappingInnerObj.prototype.setId = function(Id) {
            this.id = Id;
        };


        function commKMarker(id, title, lng, lat, categoriesArr, region, tagsArr){
            this.id = id;           //id
            this.title = title;       //title TMP
            this.lng = lng;         //lat TMP 
            this.lat = lat;         //lat TMP
            this.categoriesArr = categoriesArr;   //marker's category
            this.tagsArr = tagsArr;
            this.region = region;
        };

        function kMarker (nMarker, id, title, lng, lat, categoriesArr, floor, timeStamp, region) {
            this.nMarker = nMarker;   //naver.marker
            this.id = id;           //id
            this.title = title;       //title TMP
            this.lng = lng;         //lat TMP 
            this.lat = lat;         //lat TMP
            this.categoriesArr = categoriesArr;   //marker's category
            this.tagsArr = [];
            this.floor = floor;     //marker's Floor
            this.timeStamp = timeStamp;
            this.region = region;
            //this.option
            this.bOnMap = false;    //kMarker is on map or not
            this.bPolyOnMap = false;
            this.nPolygon = null;

        }
        
        kMarker.prototype.getNMarker = function() {
            return this.nMarker;
        };
        kMarker.prototype.getId = function() {
            return this.id;
        };
        kMarker.prototype.getLat = function() {
            return this.lat;
        };
        kMarker.prototype.getLng = function() {
            return this.lng;
        };
        kMarker.prototype.getCategoriesArr = function() {
            return this.categoriesArr;
        };
        kMarker.prototype.getFloor = function() {
            return this.floor;
        };
        kMarker.prototype.getTimeStamp = function() {
            return this.timeStamp;
        };
        kMarker.prototype.getRegion = function() {
            return this.region;
        };
        kMarker.prototype.getTitle = function(){
            if(this.nMarker == null){
                //return tmp title
                return this.title;
            }
            return this.nMarker.getTitle();
        };
        kMarker.prototype.getPosition = function(){
            if(this.nMarker == null){
                return null;
            }
            return this.nMarker.getPosition();
        };
        kMarker.prototype.getNPolygon = function(){
            return this.nPolygon;
        };
        kMarker.prototype.getTagsArr = function(){
            return this.tagsArr;
        };


        kMarker.prototype.isOnMap = function(){
            if(this.nMarker == null){
                console.log("isOnMap is called with no nMarker");
                return false;
            }
            return this.bOnMap;
        }
        kMarker.prototype.setOnMap = function(inMap){
            if(this.nMarker == null){
                console.log("setOnMap is called with no nMarker");
                return;
            }
            this.nMarker.setMap(inMap);
            this.bOnMap = true;
            return;
        }
        kMarker.prototype.unsetOnMap = function(){
            if(this.nMarker == null){
                console.log("unsetOnMap is called with no nMarker");
                return;
            }
            this.nMarker.setMap(null);
            this.bOnMap = false;
            return;
        }
        kMarker.prototype.isPolyOnMap = function(){
            if(this.nPolygon == null){
                console.log("isPolyOnMap is called with no nPolygon");
                return false;
            }
            return this.bPolyOnMap;
        }
        kMarker.prototype.setPolyOnMap = function(inMap){
            if(this.nPolygon == null){
                console.log("setolyOnMap is called with no nPolygon");
                return;
            }
            this.nPolygon.setMap(inMap);
            this.bPolyOnMap = true;
            return;
        }
        kMarker.prototype.unsetPolyOnMap = function(){
            if(this.nPolygon == null){
                console.log("unsetolyOnMap is called with no nPolygon");
                return;
            }
            this.nPolygon.setMap(null);
            this.bPolyOnMap = false;
            return;
        }
        kMarker.prototype.getFirstCategoryTitle = function(){
            if(this.categoriesArr.length ==0){
                console.log("category is none in getFirstCategoryTitle()");
                return "none";
            }
            return this.categoriesArr[0].getTitle()
        }


        kMarker.prototype.setNMarker = function(nMarker) {
            this.nMarker = nMarker;
        };
        kMarker.prototype.setId = function(id) {
            this.id = id
        };
        kMarker.prototype.setCategoriesArr = function(categoriesArr) {
            this.categoriesArr = categoriesArr
        };
        kMarker.prototype.addCategoryObjInArr = function(catObj) {
            this.categoriesArr.push(catObj);
        };
        kMarker.prototype.setFloor = function(floor) {
            this.floor = floor
        };
        kMarker.prototype.setTimeStamp = function(timeStamp) {
            this.timeStamp = timeStamp
        };
        kMarker.prototype.setRegion = function(region) {
            this.region = region
        };
        kMarker.prototype.setTitle = function(title){
            if(this.nMarker == null){
                return;
            }
            else{
                this.nMarker.setTitle(title);
            }
        };
        kMarker.prototype.setPositionWithPosition = function(position){
            if(this.nMarker == null){
                console.log('kMarker.prototype.setPositionWithPosition marker == null');
                return;
            }
            else{
                this.nMarker.setPosition(position);
            }
        };
        kMarker.prototype.setPositionWithLatLngNew = function(lat, lng){
            if(this.nMarker == null){
                console.log('kMarker.prototype.setPositionWithLatLngNew marker == null');
                return;
            }
            this.nMarker.setPosition(new naver.maps.LatLng(lat, lng));
        };
        kMarker.prototype.setNPolygon = function(nPolygon) {
            this.nPolygon = nPolygon
        };
        kMarker.prototype.addTag = function(tagObj){
            this.tagsArr
            return this.tagsArr;
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

        //겹침마커
        var MarkerOverlapRecognizer = function(opts) {
            this._options = $.extend({
                tolerance: 5,
                highlightRect: true,
                highlightRectStyle: {
                    strokeColor: '#ff0000',
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    strokeStyle: 'dot',
                    fillColor: '#ff0000',
                    fillOpacity: 0.5
                },
                intersectNotice: true,
                intersectNoticeTemplate: '<div style="width:180px;border:solid 1px #333;background-color:#fff;padding:5px;"><em style="font-weight:bold;color:#f00;">{{count}}</em>개의 마커가 있습니다.</div>',
                intersectList: true,
                intersectListTemplate: '<div>'/*'style="width:200px;border:solid 1px #333;background-color:#fff;padding:5px;">'
                    + '<ul style="list-style:none;margin:0;padding:0;">'
                    + '{{#repeat}}'
                    + '<li style="list-style:none;margin:0;padding:0;"><a href="#">{{order}}. {{title}}</a></li>'
                    + '{{/#repeat}}'
                    + '</ul>'*/
                    + '</div>'
            }, opts);

            this._listeners = [];
            this._markers = [];

            this._rectangle = new naver.maps.Rectangle(this._options.highlightRectStyle);
            this._overlapInfoEl = $('<div style="position:absolute;z-index:100;margin:0;padding:0;display:none;"></div>');
            this._overlapListEl = $('<div style="position:absolute;z-index:100;margin:0;padding:0;display:none;"></div>');
        };
        MarkerOverlapRecognizer.prototype = {
            constructor: MarkerOverlapRecognizer,

            setMap: function(map) {
                var oldMap = this.getMap();

                if (map === oldMap) return;

                this._unbindEvent();

                this.hide();

                if (map) {
                    this._bindEvent(map);
                    this._overlapInfoEl.appendTo(map.getPanes().floatPane);
                    this._overlapListEl.appendTo(map.getPanes().floatPane);
                }

                this.map = map || null;
            },

            getMap: function() {
                return this.map;
            },

            _bindEvent: function(map) {
                var listeners = this._listeners,
                    self = this;

                listeners.push(
                    map.addListener('idle', $.proxy(this._onIdle, this)),
                    map.addListener('click', $.proxy(this._onIdle, this))
                );

                this.forEach(function(marker) {
                    listeners = listeners.concat(self._bindMarkerEvent(marker));
                });
            },

            _unbindEvent: function(map_) {
                var map = map_ || this.getMap();

                naver.maps.Event.removeListener(this._listeners);
                this._listeners = [];

                this._rectangle.setMap(null);
                this._overlapInfoEl.remove();
                this._overlapListEl.remove();
            },

            add: function(marker) {
                this._listeners = this._listeners.concat(this._bindMarkerEvent(marker));
                this._markers.push(marker);
            },

            remove: function(marker) {
                this.forEach(function(m, i, markers) {
                    if (m === marker) {
                        markers.splice(i, 1);
                    }
                });
                this._unbindMarkerEvent(marker);
            },

            forEach: function(callback) {
                var markers = this._markers;

                for (var i=markers.length-1; i>=0; i--) {
                    callback(markers[i], i, markers);
                }
            },

            hide: function() {
                this._overlapListEl.hide();
                this._overlapInfoEl.hide();
                this._rectangle.setMap(null);
            },

            _bindMarkerEvent: function(marker) {
                marker.__intersectListeners = [
                    marker.addListener('mouseover', $.proxy(this._onOver, this)),
                    marker.addListener('mouseout', $.proxy(this._onOut, this)),
                    marker.addListener('mousedown', $.proxy(this._onDown, this))
                ];

                return marker.__intersectListeners;
            },

            _unbindMarkerEvent: function(marker) {
                naver.maps.Event.removeListener(marker.__intersectListeners);
                delete marker.__intersectListeners;
            },

            getOverlapRect: function(marker) {
                var map = this.getMap(),
                    proj = map.getProjection(),
                    position = marker.getPosition(),
                    offset = proj.fromCoordToOffset(position),
                    tolerance = this._options.tolerance || 3,
                    rectLeftTop = offset.clone().sub(tolerance, tolerance),
                    rectRightBottom = offset.clone().add(tolerance, tolerance);

                return naver.maps.PointBounds.bounds(rectLeftTop, rectRightBottom);
            },

            getOverlapedMarkers: function(marker) {
                var baseRect = this.getOverlapRect(marker),
                    overlaped = [{
                        marker: marker,
                        rect: baseRect
                    }],
                    self = this;

                this.forEach(function(m) {
                    if (m === marker) return;

                    var rect = self.getOverlapRect(m);

                    if (rect.intersects(baseRect)) {
                        overlaped.push({
                            marker: m,
                            rect: rect
                        });
                    }
                });

                return overlaped;
            },

            _onIdle: function() {
                this._overlapInfoEl.hide();
                this._overlapListEl.hide();
            },

            _onOver: function(e) {
                var marker = e.overlay,
                    map = this.getMap(),
                    proj = map.getProjection(),
                    offset = proj.fromCoordToOffset(marker.getPosition()),
                    overlaped = this.getOverlapedMarkers(marker);

                if (overlaped.length > 1) {
                    if (this._options.highlightRect) {
                        var bounds;

                        for (var i=0, ii=overlaped.length; i<ii; i++) {
                            if (bounds) {
                                bounds = bounds.union(overlaped[i].rect);
                            } else {
                                bounds = overlaped[i].rect.clone();
                            }
                        };

                        var min = proj.fromOffsetToCoord(bounds.getMin()),
                            max = proj.fromOffsetToCoord(bounds.getMax());

                        this._rectangle.setBounds( naver.maps.LatLngBounds.bounds(min, max) );
                        this._rectangle.setMap(map);
                    }

                    if (this._options.intersectNotice) {
                        this._overlapInfoEl
                            .html(this._options.intersectNoticeTemplate.replace(/\{\{count\}\}/g, overlaped.length))
                            .css({
                                left: offset.x,
                                top: offset.y
                            })
                            .show();
                    }
                } else {
                    this.hide();
                }
            },

            _onOut: function(e) {
                this._rectangle.setMap(null);
                this._overlapInfoEl.hide();
            },

            _guid: function() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
                    var r = Math.random()*16|0, v = c == "x" ? r : (r&0x3|0x8);
                    return v.toString(16);
                }).toUpperCase();
            },

            _renderIntersectList: function(overlaped, offset) {
                if (!this._options.intersectList) return;

                var listLayer = this._overlapListEl;

                var REPEAT_REGEX = /\{\{#repeat\}\}([\s\S]*)\{\{\/#repeat\}\}/gm,
                    template = this._options.intersectListTemplate,
                    itemTemplate = null,
                    itemPlace = null,
                    matches = REPEAT_REGEX.exec(template),
                    uid = this._guid(),
                    self = this;

                listLayer.empty();

                if (matches && matches.length >= 2) {
                    template = template.replace(matches[0], '<div id="intersects-'+ uid +'"></div>');
                    itemTemplate = matches[1];

                    listLayer.append($(template));

                    var placeholder = $('#intersects-'+ uid);

                    itemPlace = placeholder.parent();

                    placeholder.remove();
                    placeholder = null;
                } else {
                    itemTemplate = template;
                    itemPlace = listLayer;
                }

                var items = [];
                for (var i=0, ii=overlaped.length; i<ii; i++) {
                    //console.log(marker);
                    var c = overlaped[i],
                        item = $(itemTemplate.replace(/\{\{(\w+)\}\}/g, function(match, symbol) {
                            if (symbol === 'order') {
                                return i+1;
                            } else if (symbol in c.marker) {
                                return c.marker[symbol];
                            } else if (c.marker.get(symbol)) {
                                return c.marker.get(symbol);
                            } else {
                                match;
                            }
                        }));

                    item.on('click', $.proxy(self._onClickItem, self, c.marker));
                    items.push(item);
                };

                for (var j=0, jj=items.length; j<jj; j++) {
                    itemPlace.append(items[j]);
                }

                listLayer.css({
                            left: offset.x + 5,
                            top: offset.y
                        })
                        .show();
            },

            _onDown: function(e) {
                var marker = e.overlay,
                    map = this.getMap(),
                    proj = map.getProjection(),
                    offset = proj.fromCoordToOffset(marker.getPosition()),
                    overlaped = this.getOverlapedMarkers(marker),
                    self = this;

                naver.maps.Event.resumeDispatch(marker, 'click');

                if (overlaped.length <= 1) {
                    return;
                }

                naver.maps.Event.stopDispatch(marker, 'click');
                this._renderIntersectList(overlaped, offset);
                this._overlapInfoEl.hide();

                naver.maps.Event.trigger(this, 'overlap', overlaped);
            },

            _onClickItem: function(marker, e) {
                naver.maps.Event.resumeDispatch(marker, 'click');

                naver.maps.Event.trigger(this, 'clickItem', {
                    overlay: marker,
                    originalEvent: e.originalEvent
                });

                marker.trigger('click');
            }
        };


//constant

        var MARKER_SPRITE_X_OFFSET = 29;
        var MARKER_SPRITE_Y_OFFSET = 50;
        var MARKER_ICON_URL = 'https://ssl.pstatic.net/static/maps/img/icons/sp_pins_spot_v3.png';
        var MARKER_HIGHLIGHT_ICON_URL = 'https://ssl.pstatic.net/static/maps/img/icons/sp_pins_spot_v3_over.png';
        var MARKER_SPRITE_POSITION = {
            "카페1": [0, 0],
            "카페2": [MARKER_SPRITE_X_OFFSET, 0],
            "none": [MARKER_SPRITE_X_OFFSET*2, 0],
            "프린터": [MARKER_SPRITE_X_OFFSET*3, 0],
            "E0": [MARKER_SPRITE_X_OFFSET*4, 0],
            "F0": [MARKER_SPRITE_X_OFFSET*5, 0],
            "G0": [MARKER_SPRITE_X_OFFSET*6, 0],
            "H0": [MARKER_SPRITE_X_OFFSET*7, 0],
            "I0": [MARKER_SPRITE_X_OFFSET*8, 0],
            "A1": [0, MARKER_SPRITE_Y_OFFSET],
            "B1": [MARKER_SPRITE_X_OFFSET, MARKER_SPRITE_Y_OFFSET],
            "C1": [MARKER_SPRITE_X_OFFSET*2, MARKER_SPRITE_Y_OFFSET],
            "D1": [MARKER_SPRITE_X_OFFSET*3, MARKER_SPRITE_Y_OFFSET],
            "E1": [MARKER_SPRITE_X_OFFSET*4, MARKER_SPRITE_Y_OFFSET],
            "F1": [MARKER_SPRITE_X_OFFSET*5, MARKER_SPRITE_Y_OFFSET],
            "G1": [MARKER_SPRITE_X_OFFSET*6, MARKER_SPRITE_Y_OFFSET],
            "H1": [MARKER_SPRITE_X_OFFSET*7, MARKER_SPRITE_Y_OFFSET],
            "I1": [MARKER_SPRITE_X_OFFSET*8, MARKER_SPRITE_Y_OFFSET],
            "A2": [0, MARKER_SPRITE_Y_OFFSET*2],
            "B2": [MARKER_SPRITE_X_OFFSET, MARKER_SPRITE_Y_OFFSET*2],
            "C2": [MARKER_SPRITE_X_OFFSET*2, MARKER_SPRITE_Y_OFFSET*2],
            "D2": [MARKER_SPRITE_X_OFFSET*3, MARKER_SPRITE_Y_OFFSET*2],
            "E2": [MARKER_SPRITE_X_OFFSET*4, MARKER_SPRITE_Y_OFFSET*2],
            "F2": [MARKER_SPRITE_X_OFFSET*5, MARKER_SPRITE_Y_OFFSET*2],
            "G2": [MARKER_SPRITE_X_OFFSET*6, MARKER_SPRITE_Y_OFFSET*2],
            "H2": [MARKER_SPRITE_X_OFFSET*7, MARKER_SPRITE_Y_OFFSET*2],
            "I2": [MARKER_SPRITE_X_OFFSET*8, MARKER_SPRITE_Y_OFFSET*2]
        };
        var BLUEFLAG_URL = 'assets/images/marker/blueflag.png'
        var BLUEFLAG_SIZE_X = 46;
        var BLUEFLAG_SIZE_Y = 42;
        //var BLUEFLAG_ORIGIN_X,Y
        var BLUEFLAG_ANCHOR_X = 11;
        var BLUEFLAG_ANCHOR_Y = 40;

        var MARKER_SPRITE_SHAPE = {
            coords: [11, 0, 9, 0, 6, 1, 4, 2, 2, 4,
                0, 8, 0, 12, 1, 14, 2, 16, 5, 19,
                5, 20, 6, 23, 8, 26, 9, 30, 9, 34,
                13, 34, 13, 30, 14, 26, 16, 23, 17, 20,
                17, 19, 20, 16, 21, 14, 22, 12, 22, 12,
                22, 8, 20, 4, 18, 2, 16, 1, 13, 0],
            type: 'poly'
        };
        var drawingMenuModify = [
            {"name":"마커", "type":"MARKER", "icon" : "icon-map-marker"}, 
            {"name":"다각형", "type":"POLYGON", "icon" : "icon-polymer"},   
            {"name":"수정완료", "type":"CREATE", "icon" : "icon-play-box-outline"},
            {"name":"취소", "type":"CANCEL", "icon" : "icon-cancel"}
        ];
        var drawingMenuCreate = [
            {"name":"마커", "type":"MARKER", "icon" : "icon-map-marker"}, 
            {"name":"다각형", "type":"POLYGON", "icon" : "icon-polymer"},   
            {"name":"생성", "type":"CREATE", "icon" : "icon-play-box-outline"},
            {"name":"취소", "type":"CANCEL", "icon" : "icon-cancel"}
        ];


//data
        var vm = this;
        var marker;

        vm.markerDataArr = MarkerData.data;
        var categoryMenu = CategoryMenuData.data;
        var categoryTypes = CategoryTypes.data;

        //vm.categories = MarkerData.data;
        vm.kMarkerStorageArr = [];    //kMarkerStorageArr
        //vm.nMarkerStorageArr = [];      //nMarkerStorageArr depreciated
        vm.nMarkerTitleToKMarkerMappingObj = {};      //nMarkerTitleToKMarkerMappingObj. With Title, can get KMarker
        vm.categoriesToKMarkerMappingObj = {};
        vm.kMarkersOnMap = [];  //nMarker.setmap(map) 되어 있는 kMarker들의 배열
        

    //naver map
        var mapDiv = document.getElementById('nmap'); // 'map' 으로 선언해도 동일
        //옵션 없이 지도 객체를 생성하면 서울시청을 중심으로 하는 11레벨의 지도가 생성됩니다.
        var map = new naver.maps.Map('nmap', {
            center: new naver.maps.LatLng(mapLocation.lastLat, mapLocation.lastLng),
            zoom: 12,
            scaleControl: true,    //좌하단 축척
            logoControl: true,     //척도 옆 로고
            mapDataControl: true,   //좌하단 저작권표시
            mapTypeControl: true,   //일반/위성
            zoomControl: true   //좌상단 스크롤
        });
    
    //user location marker
        var userLocationMarker = null;  // userLocationMarker


    //겹침마커처리
        var bounds = map.getBounds(),
            southWest = bounds.getSW(),
            northEast = bounds.getNE(),
            lngSpan = northEast.lng() - southWest.lng(),
            latSpan = northEast.lat() - southWest.lat();
        var recognizer = new MarkerOverlapRecognizer({
            highlightRect: false,
            tolerance: 5
        }); 
        var overlapCoverMarker = null;
        recognizer.setMap(map);
        naver.maps.Event.addListener(recognizer, 'overlap', recognizerOverlapListener);
        naver.maps.Event.addListener(recognizer, 'clickItem', recognizerClickItem);

    //카테고리버튼   
        var CATEGORY_LIMIT_NUM = 4; //카테고리 버튼에서 나타낼 최대 카테고리 수
        var currentCategoryIdx = 0;         //현재 카테고리 index
        var currentWholeCategoryData = [];   //해당 카테고리의 전체 array
        vm.categoryIsOpen = false;  //카테고리 버튼의 open 여부 bind
        vm.tooltipVisible = false;  //카테고리 툴팁의 visible 여부 bind
        vm.limitNum = CATEGORY_LIMIT_NUM;   //나타낼 현재 카테고리 (limit)수
        vm.nextCat = false;     //다음 카테고리 존재 여부. (next button)
        vm.currentCategoryData = [];         //인쇄할 4개 이하의 카테고리 array
        vm.bCategoryButtonIsEnable = true;  //카테고리 버튼 활성화

    //drawing
        vm.bIsModifyMode = false;
        vm.drawingMenu = drawingMenuCreate;
        

//methods
        vm.userCheckFunc = userCheckFunc;
        vm.commGetDataFromServerFunc = commGetDataFromServerFunc;
        vm.createKMarkerStorageArrFromDataWithCategoryFunc = createKMarkerStorageArrFromDataWithCategory;
        vm.createNMarkerFromKMarkerStorageArrFunc = createNMarkerFromKMarkerStorageArr;
        vm.setMapToNMarkersWithCategoryKMarkersArrFunc = setMapToNMarkersWithCategoryKMarkersArr;
        vm.highlightMarkerFunc = highlightMarker;
        vm.unhighlightMarkerFunc = unhighlightMarker;
        vm.moveToUserLocation = moveToUserLocation;
        vm.categorySelect = categorySelect;
        vm.selectDrawingMenu = selectDrawingMenu;
//rootscope on
        $rootScope.$on('ToMain', function (event, args) {
                if(args.type == "modifyShape"){
                    //start modify Shape
                }
            }
        );

//regitster function
    //permission
        function userCheckFunc(){
            /*var userval = $sessionStorage.get('useremail');
            if(userval == undefined){
                alert('로그인 되어 있지 않거나 세션 유효기간이 끝나 로그아웃 되었습니다.');
                $state.go('app.login');
            }*/
        };

    //마커겹침문제
        function recognizerOverlapListener(list) {
            if (overlapCoverMarker) {
                unhighlightMarker(overlapCoverMarker);
            }

            overlapCoverMarker = list[0].marker;
            console.log(list);
            startSideBarWithNMarkersArr(list);
            //여러개의 list 처리.

            naver.maps.Event.once(overlapCoverMarker, 'mouseout', function() {
                unhighlightMarker(overlapCoverMarker);
            });
        };

        function recognizerClickItem(e) {
            recognizer.hide();

            if (overlapCoverMarker) {
                unhighlightMarker(overlapCoverMarker);

                overlapCoverMarker = null;
            }
        };

    //마커 highlighting
        function highlightMarker(marker) {
            var icon = marker.getIcon();

            if (icon.url !== MARKER_HIGHLIGHT_ICON_URL) {
                icon.url = MARKER_HIGHLIGHT_ICON_URL;
                marker.setIcon(icon);
            }

            marker.setZIndex(100);
        };

        //마커 unhighlighting
        function unhighlightMarker(marker) {
            var icon = marker.getIcon();

            if (icon.url === MARKER_HIGHLIGHT_ICON_URL) {
                icon.url = MARKER_ICON_URL;
                marker.setIcon(icon);
            }

            marker.setZIndex(20);
        };
    //마커 listener
        function nMarkerListenerMouseover(e){
            vm.highlightMarkerFunc(e.overlay);
        };
        function nMarkerListenerMouseout(e){
            vm.unhighlightMarkerFunc(e.overlay);
        };
        function nMarkerListenerClick(e){
            var m = e.overlay;
            console.log(e.overlay);
            //alert(m.title);
            //get kMarker with title
            var tempKMarker = vm.nMarkerTitleToKMarkerMappingObj[m.title];
            startSideBarWithKMarker(tempKMarker);

        };

    //nMarkersArr로 side open
        function startSideBarWithNMarkersArr(list){
            var tempKMarkerArr = [];
            for(var i = 0, ii = list.length; i<ii; i++){
                tempKMarkerArr.push(vm.nMarkerTitleToKMarkerMappingObj[list[i].marker.title]);
            }
            sideMapCommService.startSideBar(tempKMarkerArr);
            $rootScope.$broadcast('ToSide', {
                type : 'bOpen',
                bOpen : true
            });

        };
        function startSideBarWithKMarker(inKMarker){
            var tempKMarkerArr = [];
            tempKMarkerArr.push(inKMarker);
            sideMapCommService.startSideBar(tempKMarkerArr);
            $rootScope.$broadcast('ToSide', {
                type : 'bOpen',
                bOpen : true
            });
        };

    //dialog 실행 function : showDialog-
        //main dialog
        function showDialogMainDialog(inKMarker) {
            $mdDialog.show({
                controller          : 'MainDialogController',
                controllerAs        : 'vm',
                templateUrl         : 'app/main/map/map-mainDialog/mainDialog.html',
                parent              : angular.element(document.body),
                //targetEvent         : ev,
                clickOutsideToClose : true,
                fullscreen          : false, // Only for -xs, -sm breakpoints.
                resolve:{
                    kMarkerData : function(){
                        return inKMarker;
                    },
                    CategoryMenuData : function(){
                        return categoryMenu;
                    },
                    nMarkerTitleToKMarkerMappingObj : function(){
                        return vm.nMarkerTitleToKMarkerMappingObj;
                    },
                    categoriesToKMarkerMappingObj : function(){
                        return vm.categoriesToKMarkerMappingObj;
                    },
                    kMarkerStorageArr : function(){
                        return vm.kMarkerStorageArr;
                    },
                    kMarkersOnMap : function(){
                        return vm.kMarkersOnMap;
                    }                    
                }
            })
            .then(function(answer) {
                if(answer.respond == "modifyShape"){
                    //start modify shape
                    startModifyMode();   
                }            
            }, function() {
                
            });
        };

    //data comm functions
        //server에서 데이터를 가져 옵니다. arr에 해당하는 catetory로 query 생성/요청합니다.
        function commGetDataFromServerFunc(inCategoryTitleArr){
            //vm.markerDataArr = null;
            if(inCategoryTitleArr == undefined || inCategoryTitleArr == null){
                console.log("wrong param in ");
            }
            else if(inCategoryTitleArr.length == 0 || inCategoryTitleArr[0] == "ALL"){
                //get all Data)
            }
                
            else{
                //TODO : get data from server with 'category' query
            }
            
            //DELETE : implement http

            //http
            /*function GetAreaUser(){
                return $http({
                    method: 'GET',
                    url: './api/map?type=user',
                    headers: {'x-auth-token': $sessionStorage.get('AuthToken')}
                });
            }       */
        };

        //server에서 데이터를 가져와서 vm.kMarkerStorageArr를 새로 생성합니다..
        /*function createKMarkerStorageArrFromData(){
            //TODO : delete left data using kMarkerStorageArr

            vm.kMarkerStorageArr = [];
            for(var i=0, ii=vm.markerDataArr.length; i<ii; i++){

                var tempMarkerData = vm.markerDataArr[i];

                if(vm.nMarkerTitleToKMarkerMappingObj[vm.markerDataArr[i].title] == 없어)

                    vm.kMarkerStorageArr[i] = new kMarker(null, 
                    tempMarkerData.id,
                    tempMarkerData.name,        //to title
                    tempMarkerData.center.lng,
                    tempMarkerData.center.lat,
                    tempMarkerData.markerCategory,  //to categories. TODO : make Object
                    tempMarkerData.floor,
                    tempMarkerData.timeStamp,
                    tempMarkerData.region
                    );
            }
        };*/

    //data function
        //카테고리에 해당하는 데이터를 가져와 kMarker를 생성한다. bInit == true 인 경우 새로 생성.
        function createKMarkerStorageArrFromDataWithCategory(inCategoryTitleArr, bInit){
            var newKMarkerArr = [];
            //vm.kMarkerStorageArr = [];
            if(bInit == true){
                //TODO : delete left data using kMarkerStorageArr
                vm.kMarkerStorageArr = [];
            }

            //vm.categoriesToKMarkerMappingObj에 해당되는 category key가 없으면 추가.
            for(var i=0, ii=inCategoryTitleArr.length; i<ii; i++){

                //inCategoryTitleArr[i] key가 존재하는가?
                if(vm.categoriesToKMarkerMappingObj.hasOwnProperty(inCategoryTitleArr[i])){
                    if(vm.categoriesToKMarkerMappingObj[inCategoryTitleArr[i]].getTF() == "F"){
                        //marker들은 있지만 해당 카테고리를 조건으로 data를 가져온 적이 없다.
                        vm.categoriesToKMarkerMappingObj[inCategoryTitleArr[i]].setTF("T");
                    }
                    else{
                        //해당 카테고리를 조건으로 data를 가져온 적이 이미 있다.
                        return;
                    }
                }
                else{
                    //marker도 없고 해당 카테고리 조건으로 data를 가져온 적도 없음.
                    vm.categoriesToKMarkerMappingObj[inCategoryTitleArr[i]] = new categoriesToKMarkerMappingInnerObj([], "T");
                }
            }
            
            //TODO : get Data From server
            commGetDataFromServerFunc(inCategoryTitleArr); // --> vm.markerDataArr
            console.log(vm.markerDataArr.length);

            for(var i=0, ii=vm.markerDataArr.length; i<ii; i++){
                console.log("+");
                var tempMarkerData = vm.markerDataArr[i];
                //console.log(tempMarkerData);
                
                //nMarker가 없다. 즉 kMarker도 없다. 생성 필요.
                if(!vm.nMarkerTitleToKMarkerMappingObj.hasOwnProperty(vm.markerDataArr[i].title)){
                    //tempMarkerData와 tempCategories[j]가 comm data와 연관.
                    
                    var newKMarker = new kMarker(null, 
                            tempMarkerData.id,
                            tempMarkerData.name,        //to title
                            tempMarkerData.center.lng,
                            tempMarkerData.center.lat,
                            [], //new kMarkerCategoryObj(,),  //to categories
                            tempMarkerData.floor,
                            tempMarkerData.timeStamp,
                            tempMarkerData.region
                        );
                    //create nPolygon
                    if(newKMarker.getRegion() != null){
                        var tempRegion = newKMarker.getRegion();
                        var tempPaths = [];
                        var tempInnerPaths = [];
                        for(var j=0, jj = tempRegion.path.length; j<jj; j++){
                            tempInnerPaths.push(new naver.maps.LatLng(tempRegion.path[j].lat, tempRegion.path[j].lng));
                        }
                        tempPaths.push(tempInnerPaths);
                        var tempNPolygon = new naver.maps.Polygon({
                            //map: map,
                            paths: tempInnerPaths,
                            fillColor: '#ff0000',
                            fillOpacity: 0.3,
                            strokeColor: '#ff0000',
                            strokeOpacity: 0.6,
                            strokeWeight: 3
                        });
                        newKMarker.setNPolygon(tempNPolygon);
                    }

                    //각각의 kMarker에 대해 vm.categoriesToKMarkerMappingObj에 등록.
                    var tempCategories = tempMarkerData.markerCategory; //newKMarker.getCategoriesArr();
                    for(var j=0, jj=tempCategories.length; j<jj; j++){  //comm을 통해 얻은 tempMarkerData.markerCategory가 array라고 가정 
                        newKMarker.addCategoryObjInArr(new kMarkerCategoryObj(tempCategories[j].id, tempCategories[j].name));
                        //kMarker에 해당하는 모든 categories에 대해 vm.categoriesToKMarkerMappingObj에 등록한다.
                        if(!vm.categoriesToKMarkerMappingObj.hasOwnProperty(tempCategories[j].name)){             
                            //해당 카테고리가 categoriesToKMarkerMappingObj의 key로 존재하지 않는 경우
                            vm.categoriesToKMarkerMappingObj[tempCategories[j].name] = new categoriesToKMarkerMappingInnerObj([], "F");
                        }
                        vm.categoriesToKMarkerMappingObj[tempCategories[j].name].getKMarkersArr().push(newKMarker);   //category mapping kMarker추가
                    }

                    vm.kMarkerStorageArr.push(newKMarker);  //kMarker storage에 추가
                    newKMarkerArr.push(newKMarker); //새로 추가된 kMarker만으로 createNMarkerFromKMarkerStorageArr()에서 nMarker를 만들기 위해서.

                    //nMarkerTitleToKMarker에 kMarker 추가는 다른 함수에서 추가.
                }
                
            }
            //console.log(newKMarkerArr);

            return newKMarkerArr;   //새로 추가된 kMarkers
                    
        };


        //kMarker.marker == null... then add naver.marker to kMarker & add vm.nMarkerTitleToKMarkerMappingObj & vm.nMarkerStorageArr
        /*
            newKMarkerArr를 모르거나 존재하지 않고 category 1개에 대한 nMarker 생성인 경우 param(null, inCategoryTitle,)
            newKMarkerArr를 알면 param(newKMarkerArr, null,) OR prarm(newKMarkerArr, inCategoryTitle,). 동작 방식은 같음.
            newKMarkerArr를 모르거나 존재하지 않고 category 또한 모르면 존재하는 모든 kMarker에 대해 nMarker를 생성 시작한다. param(null, null,)
        */
        function createNMarkerFromKMarkerStorageArr(newKMarkerArr, inCategoryTitle, bInit){

            if(bInit == true){
                //TODO : delete left data using vm.nMarkerStorageArr, vm.nMarkerTitleToKMarkerMappingObj
                //vm.nMarkerStorageArr = [];  
            }
            var tempKMarkerArr;

            if(newKMarkerArr == null && inCategoryTitle != null){
                //create nMarker with catetory
                tempKMarkerArr = vm.categoriesToKMarkerMappingObj[inCategoryTitle].getKMarkersArr();
                
            }
            else if(newKMarkerArr != null){
                //newKMarkerArr nMarker with list.
                tempKMarkerArr = newKMarkerArr;
            }
            else{
                //newKMarkerArr == null && inCategoryTitle == null... create nMarker All
                tempKMarkerArr = vm.kMarkerStorageArr;
            }
            
            for(var i=0, ii=tempKMarkerArr.length; i<ii; i++){
                if(!vm.nMarkerTitleToKMarkerMappingObj.hasOwnProperty(tempKMarkerArr[i].getTitle())){
                    if(tempKMarkerArr[i].getNMarker == null){
                        console.log("createNMarkerFromKMarkerStorageArr. 없어야(null) 할 kMarker의 marker가 존재함.");
                    }
                    var tempNMarker = new naver.maps.Marker({
                        //map: map,
                        position: new naver.maps.LatLng(tempKMarkerArr[i].getLat(), tempKMarkerArr[i].getLng()),
                        title: tempKMarkerArr[i].getTitle(),    //set title with kMarker.title(TMP)
                        icon: {
                            url: MARKER_ICON_URL,
                            size: new naver.maps.Size(24, 37),
                            anchor: new naver.maps.Point(12, 37),
                            origin: new naver.maps.Point(MARKER_SPRITE_POSITION[tempKMarkerArr[i].getFirstCategoryTitle()][0], MARKER_SPRITE_POSITION[tempKMarkerArr[i].getFirstCategoryTitle()][1])
                        },
                        shape: MARKER_SPRITE_SHAPE,
                        zIndex: 20
                    });

                    tempKMarkerArr[i].setNMarker(tempNMarker);
                    
                    vm.nMarkerTitleToKMarkerMappingObj[tempKMarkerArr[i].getTitle()] = tempKMarkerArr[i];   //nMarkerTitleToKMarkerMappingObj에 등록

                    //register listener
                    tempNMarker.addListener('mouseover', nMarkerListenerMouseover);
                    tempNMarker.addListener('mouseout', nMarkerListenerMouseout);
                    tempNMarker.addListener('click', nMarkerListenerClick);
                    recognizer.add(tempNMarker);

                    window.MARKER = tempNMarker;
                }
                else{
                    //aleady has nMarker in kMarker
                }
            }
        };

        //inCategoryTitleArr 해당하는 nMarkers를 map상에 올림. bSetMapNullNMarkersOnMap인 경우 현재 map상에 표시되는 모든 nMarker를 내림.
        //inCategoryTitleArr는 array만 받으며 ALL을 전달 할 때 ["ALL"]을 전달.
        function setMapToNMarkersWithCategoryKMarkersArr(inCategoryTitleArr, bSetMapNullNMarkersOnMap){
            //현재 map상에 있는 nMarker 해제
            if(bSetMapNullNMarkersOnMap == true){
                //setMap 모두 해제
                for(var i=0, ii = vm.kMarkersOnMap.length; i<ii; i++){
                    vm.kMarkersOnMap[i].unsetOnMap();
                    vm.kMarkersOnMap[i].unsetPolyOnMap();
                }
                vm.kMarkersOnMap = []; //init vm.kMarkersOnMap
            }
            //허용되지 않은 param
            if(inCategoryTitleArr == undefined || inCategoryTitleArr == null){
                console.log("setMapToNMarkersWithCategoryKMarkersArr param error");
                return;
            }
            if(inCategoryTitleArr.length == 0){
                console.log("inCategoryTitleArr length = 0. Just remove markers on map");
                return;
            }


            //inCategoryTitleArr All case
            if(inCategoryTitleArr[0] == "ALL"){
                for(var i=0, ii = vm.kMarkerStorageArr.length; i<ii; i++){
                    vm.kMarkerStorageArr[i].setOnMap(map);
                    vm.kMarkerStorageArr[i].setPolyOnMap(map);
                    //register on vm.kMarkersOnMap
                    vm.kMarkersOnMap.push(vm.kMarkerStorageArr[i]);
                }
            }
            //specified inCategoryTitleArr case
            else{   
                for(var i=0, ii = inCategoryTitleArr.length; i<ii; i++){
                    //use inCategoryTitleArr[i]

                    //console.log(vm.categoriesToKMarkerMappingObj);
                    for(var j = 0, jj = vm.categoriesToKMarkerMappingObj[inCategoryTitleArr[i]].getKMarkersArr().length; j<jj; j++){
                        //use vm.categoriesToKMarkerMappingObj[inCategoryTitleArr[i]].getKMarkersArr()
                         var tempKMarkersArr = vm.categoriesToKMarkerMappingObj[inCategoryTitleArr[i]].getKMarkersArr();
                         //use tempKMarkersArr[j] typeof kMarker
                         if(tempKMarkersArr[j].isOnMap() == false){
                            tempKMarkersArr[j].setOnMap(map);
                            tempKMarkersArr[j].setPolyOnMap(map);
                            vm.kMarkersOnMap.push(tempKMarkersArr[j]);
                         }
                    }
                }
            }
        }

    //user location button function
        //user 위치
        function moveToUserLocation(){
            //$state.go('app.main.map.side');
            if(userLocationMarker != null){
                userLocationMarker.setMap(null);
                userLocationMarker = null;    
            }
            else{
                userLocationMarker = new naver.maps.Marker({  
                    position: new naver.maps.LatLng(37.5666805, 126.9784147),
                    draggable: false, // 도착 마커가 드래그 가능하도록 설정합니다
                    animation: naver.maps.Animation.DROP,
                    icon: {
                        url: BLUEFLAG_URL,
                        size: new naver.maps.Size(BLUEFLAG_SIZE_X, BLUEFLAG_SIZE_X),
                        origin: new naver.maps.Point(0, 0),
                        anchor: new naver.maps.Point(BLUEFLAG_ANCHOR_X, BLUEFLAG_ANCHOR_Y)
                    }
                });
                map.panTo(new naver.maps.LatLng(37.5666805, 126.9784147), {duration : 400, easing : 'easeOutCubic'});
                setTimeout(function(){
                        if(userLocationMarker != null){
                            userLocationMarker.setMap(map);
                        }
                    }, 100);
                
            } 
            //alert(vm.userLat + " " + vm.userLng);
            if(mapLocation.userLastLat != 0 && mapLocation.userLastLng!= 0){
                var dragendListenerLat = angular.copy(mapLocation.userLastLat);
                var dragendListenerLng = angular.copy(mapLocation.userLastLng);
                /*var dragendMoveLatLon = isLatlngInSkkuMap(dragendListenerLat, dragendListenerLng);
                if(false == dragendMoveLatLon){
                    //alert('out of region');
                }
                else{
                    if(arriveMarker != null){
                        arriveMarker.setMap(null);
                    }
                    if(isArriveMarkerOn == true){
                        isArriveMarkerOn = false;
                    }
                    else{
                        isArriveMarkerOn = true;
                        arriveMarker = new daum.maps.Marker({  
                            position: dragendMoveLatLon,
                            draggable: false, // 도착 마커가 드래그 가능하도록 설정합니다
                            image: arriveImage // 도착 마커이미지를 설정합니다
                        });
                        arriveMarker.setMap(map);
                        map.panTo(dragendMoveLatLon);
                    }
                }*/
                if(userLocationMarker != null){
                    userLocationMarker.setMap(null);
                    userLocationMarker = null;    
                }
                else{
                    userLocationMarker = new naver.maps.Marker({  
                        position: new naver.maps.LatLng(37.5666805, 126.9784147),
                        draggable: false, // 도착 마커가 드래그 가능하도록 설정합니다
                        animation: naver.maps.Animation.DROP,
                        icon: {
                            url: BLUEFLAG_URL,
                            size: new naver.maps.Size(BLUEFLAG_SIZE_X, BLUEFLAG_SIZE_X),
                            origin: new naver.maps.Point(0, 0),
                            anchor: new naver.maps.Point(BLUEFLAG_ANCHOR_X, BLUEFLAG_ANCHOR_Y)
                        }
                    });
                    map.panTo(new naver.maps.LatLng(37.5666805, 126.9784147), {duration : 400, easing : 'easeOutCubic'});
                    setTimeout(function(){
                            if(userLocationMarker != null){
                                userLocationMarker.setMap(map);
                            }
                        }, 100);
                    
            } 
                                
            }
        };

    //category button function
        //표시할 4개의 카테고리 리스트를 가져오는 함수.
        function get4CategoryObj(curIdx, objc){
            var ret = [];
            //console.log("oblen : " + objc.length);
            var fixedCurIdx = curIdx;
            for(var i = 0; i<objc.length-fixedCurIdx && i<CATEGORY_LIMIT_NUM; i++, curIdx++){
                ret[i] = objc[curIdx];
                //console.log("...");
            }
            if(objc.length > curIdx){
                vm.nextCat = true;
            }
            else{
                vm.nextCat = false;
            }
            vm.limitNum = i;
            //console.log("lmitm : " + vm.limitNum);
            return ret;
        }

        //카테고리 버튼 관련 variable 초기화
        function initCategorySelect(){
            //configNextCat();
            currentCategoryIdx = 0;
            currentWholeCategoryData = categoryMenu; //초기 데이터
            //console.log(vm.categoryMenu);
            vm.currentCategoryData = get4CategoryObj(currentCategoryIdx, currentWholeCategoryData);
            vm.limitNum = CATEGORY_LIMIT_NUM;
            
            //console.log(vm.currentCategoryData);
        }
        function configNextCat(){
            if(vm.currentCategoryData.length > CATEGORY_LIMIT_NUM){
                vm.nextCat = true;
            }
        }
        //카테고리 버튼 눌린 경우 호출되는 함수. 
        function categorySelect(answer){
            if(answer == "NEXT"){
                currentCategoryIdx += 4;
                vm.currentCategoryData = get4CategoryObj(currentCategoryIdx, currentWholeCategoryData);
                $timeout(function () {
                        vm.categoryIsOpen = true;
                    }, 600);
            }
            else{
                for(var i=0; i<vm.currentCategoryData.length; i++){
                    if(vm.currentCategoryData[i]["type"] == answer){
                        vm.currentCategoryData = vm.currentCategoryData[i];
                    }
                }
                //더 이상 inner 카테고리가 없는 경우, 표시되는 카테고리 리스트가 최하단 리스트
                if(!("inner" in vm.currentCategoryData)){
                    //vm.categoryStatus = answer;
                    if(vm.currentCategoryData["type"] == "none"){
                        //없는 카테고리이므로 되돌아간다.
                        initCategorySelect();
                        //TODO : category selected
                        console.log("//TODO : category selected");
                    }
                    else{
                        initCategorySelect();   
                        //TODO : category selected  
                        console.log("//TODO : category selected");                   
                    }
                    
                }
                else{
                    currentWholeCategoryData = vm.currentCategoryData["inner"];
                    currentCategoryIdx = 0;
                    vm.currentCategoryData = get4CategoryObj(currentCategoryIdx, currentWholeCategoryData);
                    //카테고리 재 오픈
                    $timeout(function () {
                        vm.categoryIsOpen = true;
                    }, 600);
                }
                
            }
           
        }

    //drawing function
        function startModifyMode(){
            //all marker click disable(peer, category marker, category button)
            vm.bIsModifyMode = true;            //modify mode
            vm.drawingMenu = drawingMenuModify; //도구모음 리스트 변경
            vm.bCategoryButtonIsEnable = false;
            for(var i = 0, ii = vm.kMarkerStorageArr.length; i<ii; i++){
                var tempNMarker = vm.kMarkerStorageArr[i].getNMarker();
                if(tempNMarker != null){
                    tempNMarker.setClickable(false);
                }
            }
            //TODO : disable peer marker clickable
        };

        function endModifyMode(){
            //all marker click disable(peer, category marker, category button)
            vm.bIsModifyMode = false;           //create mode
            vm.drawingMenu = drawingMenuCreate; //도구모음 리스트 변경
            vm.bCategoryButtonIsEnable = true;
            for(var i = 0, ii = vm.kMarkerStorageArr.length; i<ii; i++){
                var tempNMarker = vm.kMarkerStorageArr[i].getNMarker();
                if(tempNMarker != null){
                    tempNMarker.setClickable(true);
                }
            }
            //TODO : enable peer marker clickable
        };

        function selectDrawingMenu(input){
            //input  = MARKER, POLYGON, CREATE, CANCEL
            //vm.bIsModifyMode -> create or modify
        };

    //etc
        function updateMapLocationService() {
            mapLocation.lastLat = map.getCenter().getLat();
            mapLocation.lastLng = map.getCenter().getLng();
            mapLocation.lastZoomLevel = map.getLevel();
            //mapLocation.lastCategoryStatus = vm.categoryStatus;
        };



//do stuff

        /*
        usercheck();
        mapLocation.getLocation();  //user의 gps location
        $interval(updateMapLocationService, 1000);
        */
        initCategorySelect();   //카테고리 variable 초기화
        //stream
        vm.commGetDataFromServerFunc(["프린터"]);
        var newKMarkerArr = vm.createKMarkerStorageArrFromDataWithCategoryFunc(["프린터"], false);
        vm.createNMarkerFromKMarkerStorageArrFunc(newKMarkerArr, "프린터", false);
        //stream end

        vm.setMapToNMarkersWithCategoryKMarkersArrFunc(["프린터"], true);


/*
        console.log(vm.nMarkerTitleToKMarkerMappingObj);
        console.log(vm.categoriesToKMarkerMappingObj);
        console.log(vm.kMarkerStorageArr);
        console.log(vm.kMarkersOnMap);
        */

        //vm.kMarkerStorageArr[0].setOnMap(map);

        
        
// watch
    //카테고리버튼
        //카테고리 툴팁 띄우기 지연 md-visible="vm.tooltipVisible"
        $scope.$watch(function() { return vm.categoryIsOpen}, function(newVal) {
            if (newVal) {
                $timeout(function() {
                    vm.tooltipVisible = vm.categoryIsOpen;     //delay open
                }, 600);
            } else {
                vm.tooltipVisible = vm.categoryIsOpen;
            }
        }, true);

        //카테고리 툴팁 고정
        $scope.$watch(function() { return vm.tooltipVisible}, function(newVal) {
            //console.log(newVal);
            //if vm.categoryIsOpen then
            vm.tooltipVisible = vm.categoryIsOpen;
        }, true);


        
    }

})();