(function ()
{
    'use strict';

    angular
        .module('app.core')
        .service('tutorialMarkService', tutorialMark);

    /** @ngInject */
    function tutorialMark($interval, $mdPanel, $sessionStorage)
    {
        /**
            tutorial 추가하는 방법
                1. tutorial panel html 생성
                2. map.tutorial.service.js에서 service.tutorialMarkObjList.push(new tutorialMarkObj())
                3. main.html에서 <img> 태크를 index만 1 증가시켜 그대로 태그 하나 추가.
        **/

        // variable
        var service = this;
        service._sessionStorage = $sessionStorage;
        service._mdPanel = $mdPanel;
        service.tutorialMarkObjList = [];   //관리할 tutorial mark list
        service.markerImagePath = 'assets/images/icons/exclamation-mark-tutorial.png';
        service.setCookie = setCookie;

        //service function
        service.notifyDOMChangeForTutorialMark = _notifyDOMChangeForTutorialMark;
        service.getPosition = getPosition;

        function defaultConfig(){
            this.attachTo = angular.element(document.body);
            //controller: PanelDialogCtrl,
            this.controllerAs = 'vm';
            this.disableParentScroll =false;
            //templateUrl: 'panel.tmpl.html',
            this.hasBackdrop = true;
            this.panelClass = 'tutorial-panel-class';
            //position: position,
            this.trapFocus = true;
            this.zIndex = 150;
            this.clickOutsideToClose = true;
            this.locals = {
                    ResolvedTutorialMarkService : 0,
                    tutorialMarkServiceArrIdx : 0
                    /*
                    {   tutorialMarkServiceResolvedIdx : int    }
                    */
            };
            this.escapeToClose = true;
            this.focusOnOpen = true;
        }
        

        function tutorialMarkObj(id, additionalId, incLeft, incTop, paneLeft, panelTop, markerImageHeight, markerImageWidth, config, ctrl, tempUrl, index, imgSrc, bMarker, opacity){ 
            this.id = id;   //bind id : 어느 elem에 tutorial mark를 bind 할지
            this.markerId = id + additionalId;     //main.html에서 mark의 id
            this.left = 0;      //튜토리얼 마커 position : target element의 position에 따라 동적으로 설정됨. _notifyDOMChangeForTutorialMark function
            this.top = 0;       
            this.incLeft = incLeft;    //real mark postion = target element position + incLeft || incTop
            this.incTop = incTop;
            this.incPanelLeft = paneLeft;   //realPanelPosition = target element position + inc
            this.incPanelTop = panelTop;
            this.config = config;               //panel config(default)
            this.config.controller = ctrl;      //panel controller
            this.config.templateUrl = tempUrl;  //panel url
            this.config.position = service._mdPanel.newPanelPosition().absolute().center();
            this.config.locals.ResolvedTutorialMarkService = service;
            this.bShowWithCookie = false;   //cookie의 존재 여부에 따라 해당 튜토리얼을 표시할 지 결정.
            this.bShowNow = false;          //T/F값에 따라 마커를 표시, 삭제하는 animation 동작.
            this.bMarkerNgIf = false;       //makrer image ng-if에 바인딩되는 boolean. 삭제 에니메이션 뒤 또는 target element 발견 뒤에 변경됨.
            this.config.locals.tutorialMarkServiceArrIdx = index;   //해당 marker의 index in Array
            this.imgSrc = imgSrc;                                   //src. If bMarker == false then use this as text.
            this.ngStyle = {'position':'absolute', 'left' : incLeft+'px', 'top' : incTop+'px', 'max-height' : markerImageHeight, 'max-width' : markerImageWidth, 'opacity' : opacity};   //marker image dynamic css style
            this.bMarker = bMarker;
        };

    //panel controllers
        function PanelDialogCtrl(mdPanelRef) {
            this._mdPanelRef = mdPanelRef;
            //this.ResolvedTutorialMarkService
            //this.tutorialMarkServiceArrIdx
        }
        PanelDialogCtrl.prototype.closeDialog = function() {
            var panelRef = this._mdPanelRef;
            //console.log("idx: " + this.tutorialMarkServiceArrIdx);
            //console.log(this.ResolvedTutorialMarkService);
            
            panelRef && panelRef.close().then(function() {
                document.getElementById('main').focus();
                panelRef.destroy();
            });
        };
        PanelDialogCtrl.prototype.closeDialogWithCookieRegister = function() {
            var panelRef = this._mdPanelRef;
            setCookie(this.ResolvedTutorialMarkService.tutorialMarkObjList[this.tutorialMarkServiceArrIdx].markerId);
            this.ResolvedTutorialMarkService.tutorialMarkObjList[this.tutorialMarkServiceArrIdx].bShowWithCookie = false;
            //this.ResolvedTutorialMarkService.setCookie(this.ResolvedTutorialMarkService.tutorialMarkObjList[this.tutorialMarkServiceArrIdx].id); //add cookie
            //this.ResolvedTutorialMarkService.tutorialMarkObjList[tutorialMarkServiceArrIdx].bShowNow = false;   //remove marker image
                
            panelRef && panelRef.close().then(function() {
                //angular.element(document.querySelector('.demo-dialog-open-button')).focus();    //class search
                document.getElementById('main').focus();
                panelRef.destroy();
            });
        };

        
    //main

        //add new tutorial target id
        service.tutorialMarkObjList.push(new tutorialMarkObj('id-map-sidemap-guide-buttom', "-tutorialMark", 120, -10, 50, -200, '60px', '60px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/sideGuideButtonTutorial.html', service.tutorialMarkObjList.length, service.markerImagePath, true, 0.0));
        //service.tutorialMarkObjList.push(new tutorialMarkObj('drawingButton', 12, -30, 50, -300,'60px', '60px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, service.markerImagePath, true));
        
        //button tutorial line & button

        service.tutorialMarkObjList.push(new tutorialMarkObj('drawingButton', "-line", 20, -60, 50, -300,'100px', '100px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "", false, 1.0));
        service.tutorialMarkObjList.push(new tutorialMarkObj('drawingButton', "-button", -30, -100, 50, -300,'100px', '100px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "지역추가 도구", false, 1.0));
        
        service.tutorialMarkObjList.push(new tutorialMarkObj('user-menu-drop-down', "-line", 30, 50, 50, -300,'100px', '100px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "", false, 1.0));
        service.tutorialMarkObjList.push(new tutorialMarkObj('user-menu-drop-down', "-button", -20, 140, 50, -300,'100px', '100px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "메인메뉴", false, 1.0));
        
        service.tutorialMarkObjList.push(new tutorialMarkObj('user-menu-right-toolbar', "-line", 30, 50, 50, -300,'100px', '100px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "", false, 1.0));
        service.tutorialMarkObjList.push(new tutorialMarkObj('user-menu-right-toolbar', "-button", -20, 140, 50, -300,'100px', '100px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "계정버튼", false, 1.0));
        
        service.tutorialMarkObjList.push(new tutorialMarkObj('search-bar-exp', "-line", 28, 50, 50, -300,'60px', '60px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "", false, 1.0));
        service.tutorialMarkObjList.push(new tutorialMarkObj('search-bar-exp', "-button", -20, 100, 50, -300,'60px', '60px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "검색", false, 1.0));
         
        service.tutorialMarkObjList.push(new tutorialMarkObj('quick-panel-toggle', "-line",  28, 50, 50, -300,'100px', '100px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "", false, 1.0));
        service.tutorialMarkObjList.push(new tutorialMarkObj('quick-panel-toggle', "-button", -20, 140, 50, -300,'60px', '60px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "패널", false, 1.0));

        service.tutorialMarkObjList.push(new tutorialMarkObj('categoryButtonPCId', "-line", 40, 25, 50, -300,'100px', '100px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "", false, 1.0));
        service.tutorialMarkObjList.push(new tutorialMarkObj('categoryButtonPCId', "-button", -15, 120, 50, -300,'100px', '100px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "카테고리버튼", false, 1.0));
        
        service.tutorialMarkObjList.push(new tutorialMarkObj('univ-button', "-line", 30, 25, 50, -300,'100px', '100px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "", false, 1.0));
        service.tutorialMarkObjList.push(new tutorialMarkObj('univ-button', "-button", -15, 115, 50, -300,'100px', '100px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "캠퍼스선택", false, 1.0));
        
        service.tutorialMarkObjList.push(new tutorialMarkObj('categoryButtonId', "-line", 20, -80, 50, -300,'100px', '100px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "", false, 1.0));
        service.tutorialMarkObjList.push(new tutorialMarkObj('categoryButtonId', "-button", -40, -120, 50, -300,'100px', '100px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "카테고리버튼", false, 1.0));
        
        service.tutorialMarkObjList.push(new tutorialMarkObj('userLocationButton', "-line", 20, -75, 50, -300,'100px', '100px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "", false, 1.0));
        service.tutorialMarkObjList.push(new tutorialMarkObj('userLocationButton', "-button", -40, -105, 50, -300,'100px', '100px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "내 위치 확인", false, 1.0));
        
        service.tutorialMarkObjList.push(new tutorialMarkObj('dragBar', "-line", -50, 0, 50, -300,'50px', '50px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "", false, 1.0));
        service.tutorialMarkObjList.push(new tutorialMarkObj('dragBar', "-button", -140, -20, 50, -300,'100px', '100px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "드래그바", false, 1.0));
        
        //service.tutorialMarkObjList.push(new tutorialMarkObj('drawingButton', "-line", 12, -30, 50, -300,'100px', '100px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "textx", false, 1.0));
        //service.tutorialMarkObjList.push(new tutorialMarkObj('drawingButton', "-button", 12, -30, 50, -300,'100px', '100px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, "textx", false, 1.0));
        

        //check cookie
        for(var i=0, ii=service.tutorialMarkObjList.length; i<ii; i++){
            if(service.tutorialMarkObjList[i].bMarker){ //튜토리얼 마커만 쿠키 확인
                if(checkCookie(service.tutorialMarkObjList[i].markerId) == true){    //쿠키 존재시
                service.tutorialMarkObjList[i].bShowWithCookie = false; //표시x
                }
                else{
                    service.tutorialMarkObjList[i].bShowWithCookie = true;  //쿠키 없을시 표시
                }
                //service.tutorialMarkObjList[i].bShowWithCookie = true;  //todo : delete
            }
        }

    //functions
        function getPosition(el) {
            var xPos = 0;
            var yPos = 0;

            while (el) {
                if (el.tagName == "BODY") {
                    // deal with browser quirks with body/window/document and page scroll
                    var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
                    var yScroll = el.scrollTop || document.documentElement.scrollTop;

                    xPos += (el.offsetLeft - xScroll + el.clientLeft);
                    yPos += (el.offsetTop - yScroll + el.clientTop);
                } else {
                    // for all other non-BODY elements
                    xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                    yPos += (el.offsetTop - el.scrollTop + el.clientTop);
                }
                el = el.offsetParent;
            }
            return {
                x: xPos,
                y: yPos
            };
        }

        //주기적으로 튜토리얼 마커에 해당하는 DOM check
        function _notifyDOMChangeForTutorialMark(){
            for(var i=0, ii=service.tutorialMarkObjList.length; i<ii; i++){
                if(service.tutorialMarkObjList[i].bShowWithCookie == true && service.tutorialMarkObjList[i].bMarker){ //튜토리얼 마커만 쿠키 확인){ //쿠키 상태 : 표시해야 하는 mark들만 검색한다.
                    var tempElem = document.getElementById(service.tutorialMarkObjList[i].id);
                    if(tempElem == null){ //튜토리얼 마크에 해당되는 element를 못찾은 경우
                        service.tutorialMarkObjList[i].bShowNow = false;    //mark 표시 off
                    }
                    else{
                        var posObj = getPosition(tempElem);
                        service.tutorialMarkObjList[i].left = posObj.x + service.tutorialMarkObjList[i].incLeft;
                        service.tutorialMarkObjList[i].top = posObj.y + service.tutorialMarkObjList[i].incTop;
                        service.tutorialMarkObjList[i].bShowNow = true;     //mark 표시 on(animation & 타켓 element가 있음을 알림.)
                        
                    }
                }
                else{
                    service.tutorialMarkObjList[i].bShowNow = false;    //mark 표시 off
                }
            }
        }

    
        //check DOM change with interval
        $interval(_notifyDOMChangeForTutorialMark, 200);


        //swallowClone
        function swallowClone(obj) {
            if (obj === null || typeof(obj) !== 'object')
                return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr) && (attr == 'ng-style' || attr =='config' || attr !=this) ){
                    copy[attr] = swallowClone(obj[attr]);
                }
            }
            return copy;
        }


        //cookie basic func
        function _setCookie(cname,cvalue,exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires=" + d.toGMTString();
            console.log(expires);
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/kinggowarts/";
        }

        function setCookie(cname) {
            //Cookie name : tutorialMark + Cookie // Cookie value : nickname
            var newCName = cname+"CookieWith"+service._sessionStorage.get('nickname');
            _setCookie(newCName, "empty", 30);   //한달 뒤에 다시 보임.
            console.log("set cookie : " + newCName);
        }

        function deleteCookie(){
            _setCookie(cname + "CookieWith" + service._sessionStorage.get('nickname'), "", 30);   //한달 뒤에 다시 보임.
        }

        function getCookie(cname) {
            var newCName = cname + "CookieWith" + service._sessionStorage.get('nickname') + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(newCName) == 0) {
                    return c.substring(newCName.length, c.length);
                }
            }
            return "";
        }

        function checkCookie(cname) {
            var newCName = cname+"CookieWith"+service._sessionStorage.get('nickname');
            var user=getCookie(newCName);
            if (user == "empty") {
                console.log("checkCookie ret true :" + newCName + "/value:" + user);
                return true;
            } else {    //user == "" || user != $sessionStorage.get('nickname')
                console.log("checkCookie ret true :" + newCName + "/value:" + user);
                return false;
            }
        }

        

    }

})();


