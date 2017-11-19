/*****************************************************************************
Copyright (c) 2017, kinggowarts team. All Rights Reserved.
*****************************************************************************/

/******************************************************
*  Document   : src/app/main/main.controller.js
*  Author     : underkoo
*  Description: main 컨트롤러 정의
*******************************************************/

(function ()
{
    'use strict';

    angular
        .module('app.main')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController($scope, $rootScope, $mdPanel, tutorialMarkService)
    {

    //variable
        var vm = this;
        vm.isWideTutorialOn = false; //wide tutorial

    //variable for animation
        var requestId = 0;
        var startime = 0;
        var lpos = 0;
        var lposIncreasing = true;

    //resolve
        vm.tutorialMarkArr = tutorialMarkService.tutorialMarkObjList;

        /* 초기화 */

        $scope.$on('$viewContentAnimationEnded', function (event) 
        {
            if ( event.targetScope.$id === $scope.$id )
            {   
                $rootScope.$broadcast('msSplashScreen::remove'); // Remove the splash screen
            }
        });


    //communication
        $scope.$on('ToWide', function (event, arg) 
        {
            if(arg.type == "wideTutorial"){
                checkDOMForTutorial();
                vm.isWideTutorialOn = arg.bOpen;
            }
        });

    //function
        vm.tutorialMarkClicked = tutorialMarkClickedFunc;
        vm.tutoriaClickedWithMiddle = tutoriaClickedWithMiddleFunc;

        function tutorialMarkClickedFunc(idx){
            //setting position
            vm.tutorialMarkArr[idx].config.position = $mdPanel.newPanelPosition()
                .absolute()
                .top((vm.tutorialMarkArr[idx].top + vm.tutorialMarkArr[idx].incPanelTop) + 'px')
                .left((vm.tutorialMarkArr[idx].left + vm.tutorialMarkArr[idx].incPanelLeft) + 'px');
            $mdPanel.open(vm.tutorialMarkArr[idx].config);
            //console.log("cliked:" + idx);
        }

        function tutoriaClickedWithMiddleFunc(idx){
            //setting position
            vm.tutorialMarkArr[idx].config.position = $mdPanel.newPanelPosition()
                .absolute()
                .center();
            $mdPanel.open(vm.tutorialMarkArr[idx].config);
        }

    //animation function
        
        
        // handle multiple browsers for requestAnimationFrame()
        window.requestAFrame = (function () {
            return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    // if all else fails, use setTimeout
                    function (callback) {
                        return window.setTimeout(callback, 1000/1); // shoot for 60 fps : 1000/60
                    };
        })();

        // handle multiple browsers for cancelAnimationFrame()
        window.cancelAFrame = (function () {
            return window.cancelAnimationFrame ||
                    window.webkitCancelAnimationFrame ||
                    window.mozCancelAnimationFrame ||
                    window.oCancelAnimationFrame ||
                    function (id) {
                        window.clearTimeout(id);
                    };
        })();

        //render function
        function render() {
            //console.log(vm.tutorialMarkArr.length);
            for(var i=0, ii=vm.tutorialMarkArr.length; i<ii; i++){
                var tempTutorialMark = vm.tutorialMarkArr[i];
                if(tempTutorialMark.bMarker == true){   //튜토리얼 마커의 경우에만 실시간 render
                    if(tempTutorialMark.bShowNow == true){
                        tempTutorialMark.bMarkerNgIf = true;   //marker ng-if on
                        var markerElem = document.getElementById(tempTutorialMark.markerId);
                        if(markerElem != null){ //marker icon이 존재하는 경우
                            document.getElementById(tempTutorialMark.markerId).style.top = tempTutorialMark.top + lpos + "px";
                            document.getElementById(tempTutorialMark.markerId).style.left = tempTutorialMark.left + "px";
                            var opt = parseFloat(document.getElementById(tempTutorialMark.markerId).style.opacity);
                            if(opt < 1.0){
                                document.getElementById(tempTutorialMark.markerId).style.opacity = opt + 0.05;
                            }

                            //up down animation
                            if(lposIncreasing){
                                if(lpos > 10){
                                    lposIncreasing = false;
                                }
                                lpos += 0.2;
                            }
                            else if(lposIncreasing == false){
                                if(lpos < -10){
                                    lposIncreasing = true;
                                }
                                lpos -= 0.2;
                            }
                        }
                    }
                    else{
                        var markerElem = document.getElementById(tempTutorialMark.markerId);
                        if(markerElem != null){ //marker icon이 존재하는 경우
                            var opt = parseFloat(document.getElementById(tempTutorialMark.markerId).style.opacity);
                            if(opt > 0.0){
                                document.getElementById(tempTutorialMark.markerId).style.opacity = opt - 0.1;
                                if(opt <= 0.1){
                                     tempTutorialMark.bMarkerNgIf = false;   //marker ng-if on
                                }
                            }
                        }
                    }
                }
            }
            requestId = window.requestAFrame(render);
        }
        function start() {
            if (window.performance.now) {
                startime = window.performance.now();
            } else {
                startime = Date.now();
            }
            requestId = window.requestAFrame(render);
        }
        function stop() {
            if (requestId)
                window.cancelAFrame(requestId);        
        }

        //튜토리얼 마커가 아닌 DOM check
        function checkDOMForTutorial() {
            console.log("checkDOMForTutorial");
            console.log(vm.tutorialMarkArr);
            for(var i=0, ii=vm.tutorialMarkArr.length; i<ii; i++){
                if(!vm.tutorialMarkArr[i].bMarker){ //튜토리얼 마커가 아닌 경우
                    var tempElem = document.getElementById(vm.tutorialMarkArr[i].id);
                    if(tempElem == null){ //튜토리얼 마크에 해당되는 element를 못찾은 경우
                        vm.tutorialMarkArr[i].bMarkerNgIf = false;    //mark 표시 off
                    }
                    else{
                        var posObj = tutorialMarkService.getPosition(tempElem);
                        vm.tutorialMarkArr[i].left = posObj.x + vm.tutorialMarkArr[i].incLeft;
                        vm.tutorialMarkArr[i].top = posObj.y + vm.tutorialMarkArr[i].incTop;
                        vm.tutorialMarkArr[i].bMarkerNgIf = true;     //mark 표시 on(animation & 타켓 element가 있음을 알림.)
                        
                    }
                }
            }
            //console.log(vm.tutorialMarkArr.length);
            for(var i=0, ii=vm.tutorialMarkArr.length; i<ii; i++){
                var tempTutorialMark = vm.tutorialMarkArr[i];
                if(tempTutorialMark.bMarker == false){
                    if(tempTutorialMark.bMarkerNgIf == true){
                        var markerElem = document.getElementById(tempTutorialMark.markerId);
                        if(markerElem != null){ //marker icon이 존재하는 경우
                            document.getElementById(tempTutorialMark.markerId).style.top = tempTutorialMark.top + "px";
                            document.getElementById(tempTutorialMark.markerId).style.left = tempTutorialMark.left + "px";
                        }
                    }
                } 
            }
        }

        
    //main
        start();

    }
})();