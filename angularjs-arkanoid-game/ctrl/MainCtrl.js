"use strict";

(function(){

    angular.module("Game")
        .controller("MainCtrl", MainCtrl);

    function MainCtrl($scope, InitOpts, CanService, CalcService){

        var CANVAS = {}, User = {}, startButton = {}, Game = {};

        CANVAS.dom = CanService.defineCanvasById.getCanvas(InitOpts.MAIN_CANVAS_ID)[0];
        CANVAS.ctx = CANVAS.dom.getContext("2d");
        CANVAS.Data = {
            "Coords": {
                X: CANVAS.dom.width/2 - 40,
                Y: CANVAS.dom.height-15
            },
            "Deviation": {
                DX: 2,
                DY: -2
            },
            "Ball": {
                "X": CANVAS.dom.width/2 + Math.random()*100,
                "Y": CANVAS.dom.height - 35
            }
        };

        startButton = InitOpts.INITIAL_START_BUTTON_DATA(CANVAS.dom.width, CANVAS.dom.height);
        User = InitOpts.INITIAL_USER_DATA;
        Game.Bricks = InitOpts.INITIAL_BRICKS_DATA;
        Game.Bricks.Coll = defineBricksIntoArray(Game.Bricks.XCount, Game.Bricks.YCount);

        $scope.title = InitOpts.APP_NAME;
        $scope.description = InitOpts.APP_DESCRIPTION;
        $scope.lives = User.Lives;

        showGameMenu("START", "bold 24px", startButton.X-42, startButton.Y+6, "#006600");
        CANVAS.dom.addEventListener("click", startGame);


        function collisionBehaviour(brickObj) {
            var dy = CANVAS.Data.Deviation.DY,
                x = CANVAS.Data.Ball.X,
                y = CANVAS.Data.Ball.Y;
            for(var i=0; i<brickObj.XCount; i++) {
                for(var j=0; j<brickObj.YCount; j++) {
                    var b = brickObj.Coll[i][j];
                    if(b.Status == 1) {
                        if(x > b.X && x < b.X+brickObj.W && y > b.Y && y < b.Y+brickObj.H) {
                            CANVAS.Data.Deviation.DY = -dy;
                            b.Status = 0;
                            User.Score++;
                            if(User.Score == brickObj.XCount* brickObj.YCount) {
                                alert("Congratulations!");
                                document.location.reload();
                            }
                        }
                    }
                }
            }
        }

        function drawByInterval() {
            var canvas = CANVAS.dom,
                x = CANVAS.Data.Ball.X,
                y = CANVAS.Data.Ball.Y,
                dx = CANVAS.Data.Deviation.DX,
                dy = CANVAS.Data.Deviation.DY,
                ballRadius = 16,
                paddleWidth = 80,
                paddleX = CANVAS.Data.Coords.X;

            CANVAS.ctx.clearRect(0, 0, canvas.width, canvas.height);
            stepRenderCanvas();
            drawLivesText();
            drawLivesNumber();
            drawScoreText();
            collisionBehaviour(Game.Bricks);

            if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
                CANVAS.Data.Deviation.DX = -dx;
            }
            if(y + dy < ballRadius) {
                CANVAS.Data.Deviation.DY = -dy;
            }
            else if(y + dy > canvas.height-ballRadius) {
                if(x > paddleX && x < paddleX + paddleWidth) {
                    CANVAS.Data.Deviation.DY = -dy;
                }
                else {
                    $scope.lives--;
                    CANVAS.Data.Deviation.DX = canvas.width/2;
                    CANVAS.Data.Deviation.DY = canvas.height-30;
                    CANVAS.Data.Deviation.DX = 2;
                    CANVAS.Data.Deviation.DY = -2;
                    CANVAS.Data.Coords.X = CANVAS.dom.width/2 - 40;
                }
            }

            CANVAS.Data.Ball.X += dx;
            CANVAS.Data.Ball.Y += dy;

            if ($scope.lives>0) {
                requestAnimationFrame(drawByInterval);
            } else {
                CanService.clearCanvas(CANVAS.ctx, CANVAS.dom.width, CANVAS.dom.height);
                showGameMenu("GAME OVER", "bold 20px", startButton.X-67, startButton.Y+6, "#990000");
                document.removeEventListener("keydown", keyboardPressed);
                document.removeEventListener("keyup", keyboardReleased);
            }
        }


        function defineBricksIntoArray(col, row){
            return CalcService.defineBricksArray(col, row);
        }

        function drawBricksIntoCanvas(ctx, bricksArr, xCount, yCount, w, h, padding, offsetX, offsetY){

            for(var i=0; i<xCount; i++) {
                for(var j=0; j<yCount; j++) {
                    if(bricksArr[i][j].Status == 1) {
                        var brickX = (j*(w+padding))+offsetX;
                        var brickY = (i*(h+padding))+offsetY;
                        bricksArr[i][j].X = brickX;
                        bricksArr[i][j].Y = brickY;
                        CanService.drawRect(ctx, brickX, brickY, w, h, "#0095DD", "#99FFFF");
                    }
                }
            }
        }

        function drawLivesIcon(xPos, yPos){
            yPos -= 10;
            //head & body
            CanService.drawCircle(CANVAS.ctx, xPos, yPos, 4, "green", 0, "black");
            CanService.drawLine(CANVAS.ctx, xPos, yPos+3, xPos, yPos+18, "green", 2);
            //lags
            CanService.drawLine(CANVAS.ctx, xPos, yPos+18, xPos-5, yPos+28, "green", 2);
            CanService.drawLine(CANVAS.ctx, xPos, yPos+18, xPos+5, yPos+28, "green", 2);
            //hands
            CanService.drawLine(CANVAS.ctx, xPos, yPos+13, xPos-10, yPos+5, "green", 2);
            CanService.drawLine(CANVAS.ctx, xPos, yPos+13, xPos+10, yPos+5, "green", 2);
        }

        function drawLivesText(){
            CanService.drawText(CANVAS.ctx, "#990000", "Lives: ", "18px", "Verdana", 15, 25);
        }

        function drawLivesNumber(){
            if ($scope.lives >= 0) {
                var coords = {x: 85, y: 20};
                for (var i = 0; i < $scope.lives; ++i) {
                    drawLivesIcon(coords.x, coords.y);
                    coords.x += 25;
                }
            }
        }

        function drawMainBall(ctx){
            CanService.drawCircle(ctx, CANVAS.Data.Ball.X, CANVAS.Data.Ball.Y, 10, "#0095DD", 1, "blue");
        }

        function drawScoreText(){
            CanService.drawText(CANVAS.ctx, "#ff4500", "Score: " + User.Score, "18px", "Verdana", CANVAS.dom.width - 100, 25);
        }

        function showGameMenu(title, fontStyle, xPos, yPos, color){
            CanService.drawRect(
                CANVAS.ctx,
                startButton.X - startButton.Width / 2,
                startButton.Y - startButton.Height / 2,
                startButton.Width,
                startButton.Height,
                "green");
            CanService.drawText(CANVAS.ctx, color, title, fontStyle, "Verdana", xPos, yPos);
        }

        function startGame(e){
            $scope.IsGameStarted = CalcService.countGameState(e.offsetX,e.offsetY,startButton.X, startButton.Width/2, startButton.Y, startButton.Height/2);
            $scope.$digest();
        }

        function stepRenderCanvas() {
            CanService.renderCanvas(
                CANVAS.ctx,
                CANVAS.Data.Coords.X,
                CANVAS.Data.Coords.Y,
                80, 15,
                "green"
            );
            drawBricksIntoCanvas(
                CANVAS.ctx,
                Game.Bricks.Coll,
                Game.Bricks.XCount,
                Game.Bricks.YCount,
                Game.Bricks.W,
                Game.Bricks.H,
                Game.Bricks.Padding,
                Game.Bricks.OffsetX,
                Game.Bricks.OffsetY);
            drawMainBall(CANVAS.ctx);
        }

        function updateCanvasImmediately(){
            drawByInterval();
        }




        function keyboardPressed(e) {
            var keyP = e.keyCode,
                x = CANVAS.Data.Coords.X;
            CANVAS.Data.Coords.X = CalcService.defineXPOS(x, keyP, CANVAS.dom.width, User.Btn);
            CanService.clearCanvas(CANVAS.ctx, CANVAS.dom.width, CANVAS.dom.height);
        }

        function keyboardReleased(e) {
            if ($scope.lives > 0) {
                CalcService.keyboardReleased(e.keyCode, User.Btn);
                CanService.clearCanvas(CANVAS.ctx, CANVAS.dom.width, CANVAS.dom.height);
            } else {
                console.log("Game Over :(");
                $scope.$digest();
            }
        }





        $scope.$watch("IsGameStarted", function(newVal){
            if (Boolean(newVal) == true) {
                CANVAS.dom.removeEventListener('click', startGame, false);
                CanService.clearCanvas(CANVAS.ctx, CANVAS.dom.width, CANVAS.dom.height);
                updateCanvasImmediately();
                document.addEventListener("keydown", keyboardPressed);
                document.addEventListener("keyup", keyboardReleased);
            }
        });

    }

    MainCtrl.$inject = ["$scope", "INIT_SETTINGS", "CanvasService", "CalcService"];

})();