"use strict";

(function(){

    angular.module("Game")
           .service("CanvasService", canvasService);

    function canvasService(){

        this.clearCanvas = clearCanvas;
        this.defineCanvasById = defineCanvasById();
        this.drawCircle = drawCircle;
        this.drawLine = drawLine;
        this.drawRect = drawRect;
        this.drawText = drawText;
        this.renderCanvas = renderCanvas;

        function clearCanvas(ctx, w, h){
            ctx.beginPath();
            ctx.fillStyle = "#eee";
            ctx.fillRect(0,0, w, h);
            ctx.closePath();
        }

        function defineCanvasById() {
            return {
                getCanvas: function(id){
                    return angular.element(document.querySelector('#'+id))
                }
            }
        }

        function drawCircle(ctx, xPos, yPox, radius, circleColor, borderLineWidth, borderColor){
            ctx.beginPath();
            ctx.arc(xPos, yPox, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = circleColor;
            ctx.fill();
            ctx.lineWidth = borderLineWidth;
            if (Boolean(borderLineWidth)==true) {
                ctx.strokeStyle = borderColor;
                ctx.stroke();
            }
            ctx.closePath();
        }

        function drawLine(ctx, xPos, yPos, xEnd, yEnd, color, lineWidth){
            ctx.beginPath();
            ctx.moveTo(xPos, yPos);
            ctx.lineTo(xEnd, yEnd);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = color;
            ctx.stroke();
            ctx.closePath();
        }

        function drawRect(ctx, xStart, yStart, xEnd, yEnd, color, fillColor){
            ctx.beginPath();
            ctx.rect(xStart,yStart,xEnd,yEnd);
            if (fillColor) {
                ctx.fillStyle = fillColor;
                ctx.fillRect(xStart,yStart,xEnd,yEnd);
            }
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
        }

        function drawText(ctx, color, text, fontSize, fontFamily, x, y){
            ctx.beginPath();
            ctx.font = fontSize+" "+fontFamily;
            ctx.fillStyle = color;
            ctx.fillText(text, x, y);
            ctx.closePath();
        }

        function renderCanvas(ctx, x, y, w, h, color) {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
            ctx.closePath();
        }

    }

})();