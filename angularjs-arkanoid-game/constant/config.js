"use strict";

(function(){

    angular.module("Game")
           .constant("INIT_SETTINGS", {
        "APP_NAME": "Arkanoid",
        "APP_DESCRIPTION": "Using Angular.js",
        "MAIN_CANVAS_ID": "canvas-game",

        "INITIAL_START_BUTTON_DATA": function(w, h){
            return {
                X: w/2,
                Y: h/2,
                Width: 150,
                Height: 80
            }
        },
        "INITIAL_USER_DATA": {
            Lives: 4,
            Score: 0,
            Btn: {
                Right: false,
                Left: false
            }
        },
        "INITIAL_BRICKS_DATA" : {
            XCount: 4,
            YCount: 5,
            W: 75,
            H: 20,
            Padding: 5,
            OffsetY: 65,
            OffsetX: 30
        }

    });

})();