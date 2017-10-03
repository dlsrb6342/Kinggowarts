
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
        //CategoryTypes,
        //AreaAdmin,
        //DrawingMenuData,
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

/*
        function commKMarker(id, title, lng, lat, categoriesArr, region, tagsArr){
            this.id = id;           //id
            this.title = title;       //title TMP
            this.lng = lng;         //lat TMP 
            this.lat = lat;         //lat TMP
            this.categoriesArr = categoriesArr;   //marker's category
            this.tagsArr = tagsArr;
            this.region = region;
        };
        */

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
            this.timeStamp = 0;

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
            //return this.categoriesArr[0].getTitle()
            return this.categoriesArr[0];
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
        kMarker.prototype.setTagsArr = function(inArr) {
            this.tagsArr = inArr;
        };
        kMarker.prototype.setTimeStampAuto = function(){
            this.timeStamp = new Date().getTime();
        };
        kMarker.prototype.getTimeStampAuto = function(){
            return this.timeStamp;
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

        var LATLNG_UNIV_SUWON = new naver.maps.LatLng(37.293669, 126.975099);
        var LATLNG_UNIV_SEOUL = new naver.maps.LatLng(37.587005, 126.993858);

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
            {"name":"수정완료", "type":"CREATE", "icon" : "icon-play-box-outline"}
            //{"name":"취소", "type":"CANCEL", "icon" : "icon-cancel"}
        ];
        var drawingMenuCreate = [
            {"name":"마커", "type":"MARKER", "icon" : "icon-map-marker"}, 
            {"name":"다각형", "type":"POLYGON", "icon" : "icon-polymer"},   
            {"name":"생성", "type":"CREATE", "icon" : "icon-play-box-outline"}
            //{"name":"취소", "type":"CANCEL", "icon" : "icon-cancel"}
        ];


//data
        var vm = this;
        var marker;
        vm.isMobile = false;    //mobile

        vm.markerDataArr = MarkerData.data;
        var categoryMenu = CategoryMenuData.data;
        //var categoryTypes = CategoryTypes.data;

        //vm.categories = MarkerData.data;
        vm.kMarkerStorageArr = [];    //kMarkerStorageArr
        //vm.nMarkerStorageArr = [];      //nMarkerStorageArr depreciated
        vm.nMarkerTitleToKMarkerMappingObj = {};      //nMarkerTitleToKMarkerMappingObj. With Title, can get KMarker
        vm.categoriesToKMarkerMappingObj = {};
        vm.kMarkersOnMap = [];  //nMarker.setmap(map) 되어 있는 kMarker들의 배열
        vm.univName=""; //univ button title
        

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

    //peer variable
        var peerMarkerList = {};
        var peerMemSeqTrueSet = new Set();
        var peerMemSeqOnMapSet = new Set(); //현재 맵위에 올라와있는 peer들의 memSeq
        var peerMemSeqSet = new Set();  //peerMarkerList에 존재하는 marker memSeq


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
        vm.bDrawingButtonIsOpen = false;
        vm.bIsModifyMode = false;
        vm.bIsCreateMode = false;
        vm.drawingMenu = drawingMenuCreate; //drawingMenuModify
        var drawingOption = {
            map: map,
            drawingMode : 0, //HAND
            polygonOptions: {
                strokeColor: '#ffd100',
                fillColor: '#ffff00',
                fillOpacity: 0.5,
                strokeWeight: 3
            },
            controlPointOptions: {
                anchorPointOptions: {
                    radius: 10,
                    fillColor: '#ff0000',
                    strokeColor: '#0000ff',
                    strokeWeight: 2
                },
                midPointOptions: {
                    radius: 10,
                    fillColor: '#ff0000',
                    strokeColor: '#0000ff',
                    strokeWeight: 2,
                    fillOpacity: 0.5
                }
            },
            drawingControl: [
                //must empty array
            ]
        };
        var drawingManager = new naver.maps.drawing.DrawingManager(drawingOption);

        //WindowGuide ngShow
        vm.ngShowWindowGuide = false;




    //버튼 show vm
        vm.ngShowCategoryButton = true;
        vm.ngShowPeerLocationButton = true;
        vm.ngShowUserLocationButton = true;
        vm.ngShowDrawingButton = true;

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
        vm.drwingButtonClicked = drwingButtonClicked;
        vm.univButtonClicked =  univButtonClicked;

        

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
            //console.log(e.overlay);
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
        /*
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
        */

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
            /* 우선 제외
            if(bInit == true){
                //TODO : delete left data using kMarkerStorageArr
                vm.kMarkerStorageArr = [];
            }*/

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

            for(var i=0, ii=vm.markerDataArr.length; i<ii; i++){
                var tempMarkerData = vm.markerDataArr[i];
                
                //nMarker가 없다. 즉 kMarker도 없다. 생성 필요.
                if(!vm.nMarkerTitleToKMarkerMappingObj.hasOwnProperty(vm.markerDataArr[i].title)){
                    //tempMarkerData와 tempCategories[j]가 comm data와 연관.
                    //console.log(tempMarkerData);

                    var tempRegion = null;
                    //path가 있는 경우
                    if(tempMarkerData.path.length != 0){
                        tempRegion = [];
                        for(var j=0, jj = tempMarkerData.path.length; j<jj; j++){
                            tempRegion.push(new naver.maps.LatLng(tempMarkerData.path[j].lat, tempMarkerData.path[j].lng));
                        }
                    }
                    var newKMarker = new kMarker(null, 
                            tempMarkerData.id,
                            tempMarkerData.name,        //to title
                            tempMarkerData.center.lng,
                            tempMarkerData.center.lat,
                            [], //to categories
                            tempMarkerData.floor,
                            tempMarkerData.timeStamp,
                            tempRegion
                        );

                    //create nPolygon
                    //path가 있는 경우
                    if(tempMarkerData.path.length != 0){
                        var tempNPolygon = new naver.maps.Polygon({
                            //map: map,
                            paths: tempRegion,
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
                        //newKMarker.addCategoryObjInArr(new kMarkerCategoryObj(tempCategories[j].id, tempCategories[j].name));
                        newKMarker.addCategoryObjInArr(tempCategories[j].name);
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
            return newKMarkerArr;   //새로 추가된 kMarkers. 주의)이미 생성되어있는 마커의 경우 리턴값에 포함되지 않는다.
            //ex) category2,3에 포함되어있는 마커가 존재하며, catetory3에 대해 이 함수를 호출하면, 처음 서술한 마커는 다음 return값에 포함되지 않음.
                    
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

        //inCategoryTitleArr(표시할 카테고리들)에 해당하는 nMarkers를 map상에 올림. bSetMapNullNMarkersOnMap인 경우 현재 map상에 표시되는 모든 nMarker를 내림.
        //inCategoryTitleArr는 array만 받으며 ALL을 전달 할 때 ["ALL"]을 전달.
        function setMapToNMarkersWithCategoryKMarkersArr(inCategoryTitleArr, bSetMapNullNMarkersOnMap){
            //현재 map상에 있는 nMarker 해제
            if(bSetMapNullNMarkersOnMap == true){
                //setMap 모두 해제
                for(var i=0, ii = vm.kMarkersOnMap.length; i<ii; i++){
                    vm.kMarkersOnMap[i].unsetOnMap();
                    vm.kMarkersOnMap[i].unsetPolyOnMap();
                }
                vm.kMarkersOnMap.length = 0;//init vm.kMarkersOnMap
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
                if(mapLocation.userLastLat != 0 && mapLocation.userLastLng!= 0){
                    //user 위치 파악된 경우
                    userLocationMarker = new naver.maps.Marker({  
                        position: new naver.maps.LatLng(mapLocation.userLastLat, mapLocation.userLastLng),
                        draggable: false, // 도착 마커가 드래그 가능하도록 설정합니다
                        animation: naver.maps.Animation.DROP,
                        icon: {
                            url: BLUEFLAG_URL,
                            size: new naver.maps.Size(BLUEFLAG_SIZE_X, BLUEFLAG_SIZE_X),
                            origin: new naver.maps.Point(0, 0),
                            anchor: new naver.maps.Point(BLUEFLAG_ANCHOR_X, BLUEFLAG_ANCHOR_Y)
                        }
                        });
                    map.panTo(new naver.maps.LatLng(mapLocation.userLastLat, mapLocation.userLastLng), {duration : 400, easing : 'easeOutCubic'});
                    setTimeout(function(){
                            if(userLocationMarker != null){
                                userLocationMarker.setMap(map);
                            }
                        }, 100);
                }
                else{
                    alert("유저의 현재 위치를 파악할 수 없습니다.");
                }
                mapLocation.userCord.cnt = mapLocation.userCord.cnt+1;  //자신의 위치 정보 버튼 클릭
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

        function startCreateMode(){
            //all marker click disable(peer, category marker, category button)
            vm.bIsCreateMode = true;            //modify mode
            $rootScope.$broadcast('ToSide', {
                    type : 'create',
                });
            vm.drawingMenu = drawingMenuCreate; //도구모음 리스트 변경
            //vm.bCategoryButtonIsEnable = false;
            for(var i = 0, ii = vm.kMarkerStorageArr.length; i<ii; i++){
                var tempNMarker = vm.kMarkerStorageArr[i].getNMarker();
                if(tempNMarker != null){
                    tempNMarker.setClickable(false);
                }
            }
            //TODO : disable peer marker clickable
        };

        function endCreateMode(){
            //all marker click disable(peer, category marker, category button)
            vm.bIsCreateMode = false;           //create mode
            vm.drawingMenu = drawingMenuCreate; //도구모음 리스트 변경
            //vm.bCategoryButtonIsEnable = true;
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
            if(input == "MARKER"){
                var tempdrawingOverlays = drawingManager.getDrawings();

                for(var key in tempdrawingOverlays){
                    if(tempdrawingOverlays[key].name == "marker"){
                        tempdrawingOverlays[key].setMap(null);
                        delete tempdrawingOverlays[key];
                    }
                }
                
                drawingManager.setOptions('drawingMode', 6);
            }
            else if(input == "POLYGON"){
                var tempdrawingOverlays = drawingManager.getDrawings();
                for(var key in tempdrawingOverlays){
                    if(tempdrawingOverlays[key].name == "polygon"){
                        tempdrawingOverlays[key].setMap(null);
                        delete tempdrawingOverlays[key];
                    }
                }
                drawingManager.setOptions('drawingMode', 5);
            }
            else if(input == "CREATE"){
                console.log(drawingManager.getDrawings());
            }
            else if(input == "CANCEL"){
                /*drawingManager.setOptions('drawingMode', 0);
                drawingManager.destroy();
                drawingManager = new naver.maps.drawing.DrawingManager(drawingOption);
                */
            }
        };
        function drawingManagerClear(){
            var tempdrawingOverlays = drawingManager.getDrawings();
            for(var key in tempdrawingOverlays){
                if(tempdrawingOverlays[key].name == "marker" || tempdrawingOverlays[key].name == "polygon"){
                    tempdrawingOverlays[key].setMap(null);
                    delete tempdrawingOverlays[key];
                }
            }
            drawingManager.setOptions('drawingMode', 0);
        };

        function drwingButtonClicked(){
            if(vm.bIsCreateMode == false){
                vm.bIsCreateMode = true;
                startCreateMode();
            }
        }

    //etc
        function updateMapLocationService() {
            mapLocation.lastLat = map.getCenter().getLat();
            mapLocation.lastLng = map.getCenter().getLng();
            mapLocation.lastZoomLevel = map.getLevel();
            //mapLocation.lastCategoryStatus = vm.categoryStatus;
        };


        //모바일인지 체크하여 drawing button을 disable 한다.
        function mobileConfig(){
            //'http://detectmobilebrowser.com/mobile'
            vm.isMobile = false;
            (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))vm.isMobile = true})(navigator.userAgent||navigator.vendor||window.opera);
            
            if(vm.isMobile){
                console.log('모바일 환경 접속 확인 완료');
                vm.ngShowDrawingButton = false;
                //$("#drawingButton").hide();
                //document.getElementById("drawingButton").hide();
            }
        };
        //주어진 sidebar width로 map과 button들의 size를 조절한다.
        function updateDocumentElementSize(sideWitdh, sideOpen){
            if(sideOpen){
                var winWitdh = $(window).width();
                document.getElementById("nmap").style.width = "" + (winWitdh - sideWitdh) + "px";
                document.getElementById("nmap").style.left = "" + sideWitdh + "px";
                document.getElementById("drawingButton").style.left = "" + (sideWitdh + 40) + "px";
                //userLocationButton, peerLocationButton display
                //버튼이 나올 너비 계산
                var widthSpace = winWitdh - sideWitdh;
                //console.log("space : " + widthSpace);
                if(widthSpace > (260)){
                    $('#userLocationButton').show();
                    //$('#peerLocationButton').show();
                    $("#categoryButtonId").show();
                    
                    /*vm.ngShowUserLocationButton = true;
                    vm.ngShowPeerLocationButton = true;
                    vm.ngShowCategoryButton = true;*/
                }
                else if(widthSpace > 210){
                    $('#userLocationButton').hide();
                    //$('#peerLocationButton').show();
                    $("#categoryButtonId").show();                    
                }
                else if(widthSpace > 160){
                    $('#userLocationButton').hide();
                    //$('#peerLocationButton').hide();
                    $("#categoryButtonId").show(); 
                }
                else{
                    $('#userLocationButton').hide();
                    //$('#peerLocationButton').hide();
                    $("#categoryButtonId").hide();
                }
            }
            else{
                //side close
                document.getElementById("nmap").style.width = "100%";
                document.getElementById("nmap").style.left = "0%";
                document.getElementById("drawingButton").style.left = "40px";
                //userLocationButton, peerLocationButton display
                /*vm.ngShowUserLocationButton = true;
                vm.ngShowPeerLocationButton = true;
                vm.ngShowCategoryButton = true;*/
                $('#userLocationButton').show();
                //$('#peerLocationButton').show();
                $("#categoryButtonId").show();
            }
            
        };

        //univ button
        function univButtonClicked(){
            if(vm.univName == "자과캠"){
                vm.univName = "인사캠";    // move to 인사캠
                univMoveToSeoul();
            }
            else{
                vm.univName = "자과캠";    // move to 자과캠
                univMoveToSuwon();
            }
        };

        function univMoveToSuwon(){
            vm.univName = "자과캠";
            mapLocation.lastLat = LATLNG_UNIV_SUWON.lat();
            mapLocation.lastLng = LATLNG_UNIV_SUWON.lng();  //app 첫 진입시 사용자 위치가 아닌 성대 중앙으로 이동
            map.panTo(LATLNG_UNIV_SUWON, {duration : 400, easing : 'easeOutCubic'});
        };

        function univMoveToSeoul(){
            /*vm.univName = "인사캠";
            mapLocation.lastLat = LATLNG_UNIV_SEOUL.lat();
            mapLocation.lastLng = LATLNG_UNIV_SEOUL.lng();  //app 첫 진입시 사용자 위치가 아닌 성대 중앙으로 이동
            map.panTo(LATLNG_UNIV_SEOUL, {duration : 400, easing : 'easeOutCubic'});
            */
            console.log(peerLocation);
        };

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



//do stuff

        
        //usercheck();
        //get univ info
        /*if(자과캠){
            univMoveToSuwon();
        }
        else{
            univMoveToSeoul();
        }*/
        univMoveToSuwon();  //TODO : 위의 조건분기를 통해 처리되어야 함.
        /*
        mapLocation.getLocation();  //user의 gps location
        $interval(updateMapLocationService, 1000);
        */
        mobileConfig();
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

        //peer의 변경 watch
        $scope.$watch(
            function watchEvent(scope){
                return(peerLocation.modified);   //갱신 버튼 누른 경우
            },
            function handleEvent(newValue, oldValue){
                if(peerLocation.peer == ""){
                    return; //아직 peerlist를 받지 않음.
                }
                peerMemSeqTrueSet = new Set();
                //memseq에 해당하는 마커를 생성하고 checked==true인 것들만 peerMemSeqTrueSet에 포함.
                for(var i=0; i<peerLocation.peer.active.length; i++){
                    var tempPeer = peerLocation.peer.active[i];
                    if(peerMemSeqSet.has(""+tempPeer.memberSeq)){   //peerMarkerList에 이미 존재하는 경우
                        
                    }
                    else{   //peerMarkerList에 존재하지 않는 경우
                        peerMarkerList[""+tempPeer.memberSeq] = new naver.maps.Marker({
                            position: new naver.maps.LatLng(tempPeer.lat, tempPeer.lng),
                            icon: {
                                content: '<div><img class="avatar mh-0" src="' + tempPeer["profileImgPath"] + '" ' + 'onerror="this.src=\'assets/images/avatars/profile.jpg\'"></img>' +'<p style="text-align: center" class="mv-0">'+ tempPeer["name"] +'</p></div>',
                                size: new naver.maps.Size(22, 35),
                                anchor: new naver.maps.Point(11, 35)
                            }
                        });
                        peerMemSeqSet.add(""+tempPeer.memberSeq);
                    }
                    if(tempPeer.hasOwnProperty('checked') && tempPeer.checked == true){
                        peerMemSeqTrueSet.add(""+tempPeer.memberSeq);
                    }
                }
                
                //get Intersection of 2 Set
                var intersection = new Set();
                for (var elem of peerMemSeqTrueSet) {
                    if (peerMemSeqOnMapSet.has(elem)) {
                        intersection.add(elem);
                    }
                }

                //marker down from map : peerMemSeqOnMapSet - intersection
                for(var elem of peerMemSeqOnMapSet){
                    if(!intersection.has(elem)){
                        //down from map
                        peerMarkerList[elem].setMap(null);
                    }
                }

                //marker on map : peerMemSeqTrueSet - intersection
                for(var elem of peerMemSeqTrueSet){
                    if(!intersection.has(elem)){
                        //on marker map
                        peerMarkerList[elem].setMap(map);
                    }
                }

                //peerMemSeqOnMapSet = peerMemSeqTrueSet + intersection
                peerMemSeqOnMapSet = peerMemSeqTrueSet;
                for(var elem of intersection){
                    peerMemSeqOnMapSet.add(elem);
                }
            }, true);

        //rootscope on
        $rootScope.$on('ToMain', function (event, args) {
                if(args.type == "api"){
                    if(args.apiType == "create"){
                        if(args.result == "success"){
                             var tempRegion = null;
                             var indata = args.data;    //commKMarker

                            //inData region
                            if(inData.region != null && inData.region.length != 0){
                                tempRegion = [];
                                for(var j=0, jj = inData.region.length; j<jj; j++){
                                    tempRegion.push(new naver.maps.LatLng(inData.region[j].lat, inData.region[j].lng));
                                }
                            }

                            //create nMarker
                            var tempNMarker = new naver.maps.Marker({
                                //map: map,
                                position: indata.center,
                                title: indata.title,    //set title with kMarker.title(TMP)
                                icon: {
                                    url: MARKER_ICON_URL,
                                    size: new naver.maps.Size(24, 37),
                                    anchor: new naver.maps.Point(12, 37),
                                    origin: new naver.maps.Point(MARKER_SPRITE_POSITION[inData.categoriesArr[0]][0], MARKER_SPRITE_POSITION[inData.categoriesArr[0]][1])
                                },
                                shape: MARKER_SPRITE_SHAPE,
                                zIndex: 20
                            });

                            
                            //register listener
                            tempNMarker.addListener('mouseover', nMarkerListenerMouseover);
                            tempNMarker.addListener('mouseout', nMarkerListenerMouseout);
                            tempNMarker.addListener('click', nMarkerListenerClick);
                            recognizer.add(tempNMarker);
                            window.MARKER = tempNMarker;

                            var newKMarker = new kMarker(
                                    tempNMarker, //nMarker
                                    indata.inDataId,
                                    null,
                                    0.0,
                                    0.0,
                                    inData.categoriesArr, //categories
                                    0,
                                    0,
                                    tempRegion
                                );

                            //create nPolygon
                            //path가 있는 경우
                            if(inData.region.length != 0){
                                var tempNPolygon = new naver.maps.Polygon({
                                    //map: map,
                                    paths: tempRegion,
                                    fillColor: '#ff0000',
                                    fillOpacity: 0.3,
                                    strokeColor: '#ff0000',
                                    strokeOpacity: 0.6,
                                    strokeWeight: 3
                                });
                                newKMarker.setNPolygon(tempNPolygon);
                            }

                            vm.nMarkerTitleToKMarkerMappingObj[indata.title] = newKMarker;   //nMarkerTitleToKMarkerMappingObj에 등록

                            //각각의 kMarker에 대해 vm.categoriesToKMarkerMappingObj에 등록.
                            var tempCategoriesForNewMarker = inData.categoriesArr; //newKMarker.getCategoriesArr();
                            for(var j=0, jj=tempCategoriesForNewMarker.length; j<jj; j++){  //comm을 통해 얻은 tempMarkerData.markerCategory가 array라고 가정 
                                
                                //kMarker에 해당하는 모든 categories에 대해 vm.categoriesToKMarkerMappingObj에 등록한다.
                                if(!vm.categoriesToKMarkerMappingObj.hasOwnProperty(tempCategoriesForNewMarker[j])){             
                                    //해당 카테고리가 categoriesToKMarkerMappingObj의 key로 존재하지 않는 경우
                                    vm.categoriesToKMarkerMappingObj[tempCatetempCategoriesForNewMarkergories[j]] = new categoriesToKMarkerMappingInnerObj([], "F");
                                }
                                vm.categoriesToKMarkerMappingObj[tempCategoriesForNewMarker[j]].getKMarkersArr().push(newKMarker);   //category mapping kMarker추가
                            }

                            vm.kMarkerStorageArr.push(newKMarker);  //kMarker storage에 추가

                            drawingManagerClear();
                            newKMarker.setOnMap();
                            newKMarker.setPolyOnMap();
                            vm.kMarkersOnMap.push(newKMarker);
                            

                            startSideBarWithKMarker(newKMarker);    //open side bar with new marker
                           /*
                            disable -> enable
                            */
                        }
                        else if(args.result == "fail"){
                            
                        }
                    }
                    else if(args.apiType == "modify"){
                        if(args.result == "success"){
                            var indata = args.data;    //commKMarker
                            var originKMarker = args.originData;

                            if(indata.title != originKMarker.getTitle()){
                                vm.nMarkerTitleToKMarkerMappingObj[indata.title] = originKMarker;
                                delete vm.nMarkerTitleToKMarkerMappingObj[originKMarker.getTitle()]
                            }
                            originKMarker.setTitle(indata.title);
                            originKMarker.setPositionWithPosition(indata.center);
                            originKMarker.setTagsArr(indata.tagsArr);
                            originKMarker.setRegion(indata.region);
                            originKMarker.unsetPolyOnMap();
                            if(inData.region != null && inData.region.length != 0){
                                var tempNPolygon = new naver.maps.Polygon({
                                    //map: map,
                                    paths: tempRegion,
                                    fillColor: '#ff0000',
                                    fillOpacity: 0.3,
                                    strokeColor: '#ff0000',
                                    strokeOpacity: 0.6,
                                    strokeWeight: 3
                                });
                                originKMarker.setNPolygon(tempNPolygon);
                            }
                            
                            //mapping 해제
                            var tempKMarkerCategoriesArr = originKMarker.getCategoriesArr();
                            for(var i = 0, ii = tempKMarkerCategoriesArr.length; i<ii; i++){
                                var tempKMarkerInnerObjArr = categoriesToKMarkerMappingObj[tempKMarkerCategoriesArr[i]].kMarker;
                                for(var j =0 , jj = tempKMarkerInnerObjArr.length; j<jj; j++){
                                    if(tempKMarkerInnerObjArr[j] == originKMarker){
                                    //if(tempKMarkerInnerObjArr[j].getTitle() == kMarkerData.getTitle())
                                        tempKMarkerInnerObjArr.splice(j,1);
                                        break;  //한개의 kMarker만 존재 할 것이므로
                                    }
                                }
                            }                       
                            
                            //mapping register
                            originKMarker.setCategoriesArr(indata.categoriesArr);
                            for(var i = 0, ii = inData.categoriesArr.length; i<ii; i++){
                                //service.categoriesToKMarkerMappingObj[inData.categoriesArr[i]] == innerMappingObj
                                categoriesToKMarkerMappingObj[inData.categoriesArr[i]].getKMarkersArr().push(originKMarker);;
                            }
                            
                            originKMarker.setPolyOnMap();

                            /*
                            disable -> enable
                            close sidebar & open new sidebar
                            */
                            drawingManagerClear();

                            for(var i=0; i < sideMapCommService.kMarkerResolvedArr.length; i++){
                                if(sideMapCommService.kMarkerResolvedArr == originKMarker){
                                    //sidebar arr를 변경하지 않고 있는 상태에서 해당 index로 open
                                    $rootScope.$broadcast('ToSide', {
                                        type : 'bOpen',
                                        bOpen : true,
                                        idx : i
                                    });
                                    break;
                                }
                            }
                            if()
                        }
                        else if(args.result == "--"){

                        }
                        
                    }
                    else if(args.apiType == "delete"){
                        if(args.result=="success"){
                            var indata = args.data;    //commKMarker
                            var originKMarker = args.originData;
                            
                            delete vm.nMarkerTitleToKMarkerMappingObj[originKMarker.getTitle()];
                            
                            originKMarker.unsetOnMap();
                            originKMarker.unsetPolyOnMap();
                            //vm.kMarkersOnMap delete
                            for(var i = 0; i<vm.kMarkersOnMap.length; i++){
                                if(vm.kMarkersOnMap[i] == originKMarker){
                                    vm.kMarkersOnMap.splice(i, 1);
                                    break;
                                }
                            }
                            
                            //mapping 해제
                            var tempKMarkerCategoriesArr = originKMarker.getCategoriesArr();
                            for(var i = 0, ii = tempKMarkerCategoriesArr.length; i<ii; i++){
                                var tempKMarkerInnerObjArr = categoriesToKMarkerMappingObj[tempKMarkerCategoriesArr[i]].kMarker;
                                for(var j =0 , jj = tempKMarkerInnerObjArr.length; j<jj; j++){
                                    if(tempKMarkerInnerObjArr[j] == originKMarker){
                                    //if(tempKMarkerInnerObjArr[j].getTitle() == kMarkerData.getTitle())
                                        tempKMarkerInnerObjArr.splice(j,1);
                                        break;  //한개의 kMarker만 존재 할 것이므로
                                    }
                                }
                            }
                            /*
                            disable -> enable
                            */
                        }
                        else if(args.result == "other state"){

                        }
                    }
                }
                else if(args.type == "bOpen"){
                    var sideWitdh = args.arg;
                    updateDocumentElementSize(sideWitdh, args.bOpen);
                }
                else if(args.type == "cancelCreate"){
                    //remote all drawing
                    drawingManager.setOptions('drawingMode', 0);
                    drawingManager.destroy();
                    drawingManager = new naver.maps.drawing.DrawingManager(drawingOption);
                    endCreateMode();
                }
                else if(args.type == "windowResize"){
                    var sideWitdh = args.arg;
                    updateDocumentElementSize(sideWitdh, args.bOpen);
                }
                else if(args.type == "windowGuide"){
                    vm.ngShowWindowGuide = args.bOnOff;
                }
            }
        }
        );

        

        


        
    }

})();