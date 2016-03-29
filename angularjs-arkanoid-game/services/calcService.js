"use strict";

(function() {

    angular.module("Game")
           .service("CalcService", function () {

        this.countGameState = countGameState;
        this.defineBricksArray = defineBricksArray;
        this.defineXPOS = defineXPOS;
        this.keyboardReleased = keyboardReleased;

        function countGameState(x, y, btnX, btnW, btnY, btnH) {
            return x > btnX - btnW && y > btnY - btnH && x < btnX + btnW && y < btnY + btnH && true;
        }

        function defineBricksArray(xCount, yCount){
            var tempArr = [];
            for(var xC=0; xC<xCount; xC++) {
                tempArr[xC] = [];
                for(var yC=0; yC<yCount; yC++) {
                    tempArr[xC][yC] = { X: 0, Y: 0, Status: 1 };
                }
            }
            return tempArr;
        }

        function defineXPOS(x, keyP, w, btnObj){
            if (x >= 0) {
                if (keyP == 37) {
                    x -= 10;
                    x = x < 0 ? 0 : x;
                    btnObj.Left = true;
                }
                if (keyP == 39) {
                    x += 10;
                    x = x >= w-80 ? w-80 : x;
                    btnObj.Right = true;
                }
            }
            return x;
        }

        function keyboardReleased(keyP, btnObj){
            if (keyP == 37) {
                btnObj.Left = false;
            }
            if (keyP == 39) {
                btnObj.Right = false;
            }
        }

    });

})();