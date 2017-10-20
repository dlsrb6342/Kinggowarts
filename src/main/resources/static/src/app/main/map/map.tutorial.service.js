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
        

        function tutorialMarkObj(id, left, top, paneLeft, panelTop, markerImageHeight, markerImageWidth, config, ctrl, tempUrl, index, imgSrc){ 
            this.id = id;   //bind id : 어느 elem에 tutorial mark를 bind 할지
            this.markerId = id + "-tutorialMark";     //main.html에서 mark의 id
            this.left = 0;      //튜토리얼 마커 position : target element의 position에 따라 동적으로 설정됨. _notifyDOMChangeForTutorialMark function
            this.top = 0;       
            this.incLeft = left;    //real mark postion = target element position + incLeft || incTop
            this.incTop = top;
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
            this.imgSrc = imgSrc;                                   //src
            this.ngStyle = {'left' : left+'px', 'top' : top+'px', 'max-height' : markerImageHeight, 'max-width' : markerImageWidth, 'opacity' : 0.0};   //marker image dynamic css style
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
        service.tutorialMarkObjList.push(new tutorialMarkObj('id-map-sidemap-guide-buttom', 120, -10, 50, -200, '60px', '60px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/sideGuideButtonTutorial.html', service.tutorialMarkObjList.length, service.markerImagePath));
        service.tutorialMarkObjList.push(new tutorialMarkObj('drawingButton', 12, -30, 50, -300,'60px', '60px',new defaultConfig(), PanelDialogCtrl, 'app/main/tutorialHtml/drawingButtonTutorial.html', service.tutorialMarkObjList.length, service.markerImagePath));
        
        //check cookie
        for(var i=0, ii=service.tutorialMarkObjList.length; i<ii; i++){
            if(checkCookie(service.tutorialMarkObjList[i].markerId) == true){    //쿠키 존재시
                service.tutorialMarkObjList[i].bShowWithCookie = false; //표시x
            }
            else{
                service.tutorialMarkObjList[i].bShowWithCookie = true;  //쿠키 없을시 표시
            }
            //service.tutorialMarkObjList[i].bShowWithCookie = true;  //todo : delete
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

        
        function _notifyDOMChangeForTutorialMark(){
            for(var i=0, ii=service.tutorialMarkObjList.length; i<ii; i++){
                if(service.tutorialMarkObjList[i].bShowWithCookie == true){ //쿠키 상태 : 표시해야 하는 mark들만 검색한다.
                    var tempElem = document.getElementById(service.tutorialMarkObjList[i].id);
                    if(tempElem == null){ //튜토리얼 마크에 해당되는 element를 못찾은 경우
                        service.tutorialMarkObjList[i].bShowNow = false;    //mark 표시 off
                    }
                    else{
                        //TODO : use getPosition and (modify position & style of mark)
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


