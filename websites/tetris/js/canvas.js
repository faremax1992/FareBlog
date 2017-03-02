(function(window){
	"use strict";
function Canvas(canvasId, width, height){
	this.canvasId = canvasId;
	this.ele = document.getElementById(canvasId);
	if(!this.ele){
		throw new Error("Must povide a valid canvas Id");
	}
	this.context = this.ele.getContext('2d');
	this.width = width || window.innerWidth;
	this.height = height || window.innerHeight;
	
	this._init();
}

Canvas.prototype = {
	constructor: Canvas,
	_init: function(){
		this.ele.width = this.width;
		this.ele.height = this.height;
	},
	clear: function(fromX, fromY, toX, toY){
		fromX = fromX || 0;
		fromY = fromY || 0;
		toX = toX || this.width;
		toY = toY || this.height;
		
		this.context.clearRect(fromX, fromY, toX, toY);
	},
	drawText: function(text, redraw, x, y, color, size){
		if(redraw) {
			this.clear(0, 0);
			this.context.textAlign = "center";
			this.context.textBaseline = "alphabetic";
		} else{
			this.context.textAlign = "start";
			this.context.textBaseline = "top";
		}
		this.context.font = (size || 25) + "px Arial";
		this.context.fillStyle = color || "#f0c";
		this.context.fillText(text, x === undefined ? (this.width / 2) : x, y === undefined ? 45 : y);
	},
	drawArrow: function(length, x, y, deg, color){
		this.context.save();
		this.context.translate(x + length / 2, y + length / 2);
		this.context.fillStyle = color || "#f0c";
		this.context.strokeStyle = color || "#f0c";
		this.context.lineJoin = 'miter';
		
		this.context.rotate(this._rad(deg)); 

		//画箭头头部
		this.context.lineWidth = length / 3;
		this.context.beginPath();
		this.context.moveTo(0, -length / 2);
		this.context.lineTo(Math.floor(0.1 * length / Math.cos(this._rad(15))), Math.floor(0.1 * length / Math.sin(this._rad(15))) - length / 2);
		this.context.lineTo(-Math.floor(0.1 * length / Math.cos(this._rad(15))), Math.floor(0.1 * length / Math.sin(this._rad(15))) - length / 2);
		this.context.closePath();
		this.context.fill();

		//画箭头尾部
		this.context.lineWidth = length / 6;
		this.context.moveTo(0, Math.floor(0.1 * length / Math.sin(this._rad(15))) - length / 2);
		this.context.lineTo(0, 0.3 * length + Math.floor(0.2 * length / Math.sin(this._rad(15))) - length / 2);
		this.context.stroke();

		this.context.restore();
	},
	_rad: function(deg){
		return deg * Math.PI / 180;
	}
};
window.Canvas = Canvas;
})(window);