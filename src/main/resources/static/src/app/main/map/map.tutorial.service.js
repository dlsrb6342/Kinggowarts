(function ()
{
    'use strict';

    angular
        .module('app.core')
        .service('tutorialMarkService', tutorialMark);

    /** @ngInject */
    function tutorialMark($interval, $mdPanel, $sessionStorage)
    {
        var service = this;
        service._$sessionStorage = $sessionStorage;
        service.notifyDOMChangeForTutorialMark = _notifyDOMChangeForTutorialMark;
        service._mdPanel = $mdPanel;
        service.tutorialMarkObjList = [];   //관리할 tutorial mark list
        service.markerImagePath = 'assets/images/icons/exclamation-mark-tutorial.png';
        var defaultConfig = {
            attachTo: angular.element(document.body),
            //controller: PanelDialogCtrl,
            controllerAs: 'vm',
            disableParentScroll: false,
            //templateUrl: 'panel.tmpl.html',
            hasBackdrop: true,
            panelClass: 'tutorial-panel-class',
            //position: position,
            trapFocus: true,
            zIndex: 150,
            clickOutsideToClose: true,
            resolve: {
                    tutorialMarkServiceResolved : function(){
                        return service;
                    }
                    /*
                    {   tutorialMarkServiceResolvedIdx : int    }
                    */
            }
            escapeToClose: true,
            focusOnOpen: true
        };

        function tutorialMarkObj(id, left, top, config, ctrl, tempUrl, index){ 
            this.id = id;
            this.left = left;
            this.top = top;
            this.config = config;
            this.config.controller = ctrl;
            this.config.templateUrl = tempUrl;
            //this.config.panelClass = id + 'TargetPanel';
            this.config.position = service._mdPanel.newPanelPosition().absolute().center();
            this.bShowWithCookie = false;
            this.bShowNow = false;
            this.config.resolve.tutorialMarkServiceResolvedIdx = index;
            //this.config.position = service._mdPanel.newPanelPosition().absolute().center(); with left, top
        };

        //panel controllers
        function PanelDialogCtrl(mdPanelRef, tutorialMarkServiceResolved, tutorialMarkServiceResolvedIdx) {
            this._mdPanelRef = mdPanelRef;
            this.ResolvedTutorialMarkService = tutorialMarkServiceResolved;
            this.tutorialMarkServiceArrIdx = tutorialMarkServiceResolvedIdx;
        }
        PanelDialogCtrl.prototype.closeDialog = function() {
            var panelRef = this._mdPanelRef;
            panelRef && panelRef.close().then(function() {
                document.getElementById('main').focus();
                panelRef.destroy();
            });
        };
        PanelDialogCtrl.prototype.closeDialogWithCookie = function() {
            var panelRef = this._mdPanelRef;
            panelRef && panelRef.close().then(function() {
                //angular.element(document.querySelector('.demo-dialog-open-button')).focus();    //class search
                document.getElementById('main').focus();
                this.ResolvedTutorialMarkService.setCookie(this.ResolvedTutorialMarkService.tutorialMarkObjList[tutorialMarkServiceArrIdx].id); //add cookie
                this.ResolvedTutorialMarkService.tutorialMarkObjList[tutorialMarkServiceArrIdx].bShowNow = false;   //remove marker image
                panelRef.destroy();
            });
        };


        //add new tutorial target id
        service.tutorialMarkObjList.push(new tutorialMarkObj('id-map-sidemap-guide-buttom', 10, 10, swallowClone(defaultConfig), PanelDialogCtrl, 'app/main/tutorialHtml/tutorial1.html', service.tutorialMarkObjList.length));
        console.log(service.tutorialMarkObjList);   //TODO : check index is same

        //check cookie
        for(var i=0, ii=service.tutorialMarkObjList.length; i<ii; i++){
            if(checkCookie(id+"Cookie") == true){
                service.tutorialMarkObjList[i].bShowWithCookie = true;
            }
            else{
                service.tutorialMarkObjList[i].bShowWithCookie = false;
            }
        }

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
                    if(document.getElementById(service.tutorialMarkObjList[i].id) == null){ //튜토리얼 마크에 해당되는 element를 못찾은 경우
                        service.tutorialMarkObjList[i].bShowNow = false;    //mark 표시 off
                    }
                    else{
                        //TODO : use getPosition and (modify position & style of mark)
                        service.tutorialMarkObjList[i].bShowNow = true;     //mark 표시 on
                    }
                }
            }
        }


        //swallowClone
        function swallowClone(obj) {
            if (obj === null || typeof(obj) !== 'object')
                return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) {
                    copy[attr] = obj[attr];
                }
            }
            return copy;
        }

        //cookie basic func
        function setCookie(cname,cvalue,exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires=" + d.toGMTString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        function setCookieWithNicknameValue(cname) {
           setCookie(cname + "Cookie", service._sessionStorage.get('nickname'), 30);   //한달 뒤에 다시 보임.
        }

        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        function checkCookie(cname) {
            var user=getCookie(cname);
            if (user == service._sessionStorage.get('nickname')) {
                return true;
            } else {    //user == "" || user != $sessionStorage.get('nickname')
                return false;
            }
        }


        

    }

})();