(function(window){
	"use strict";

	function Help(){
		this.canvas = new Canvas("game-help", 100, 150);

		this._init();
	}

	Help.prototype = {
		constructor: Help,
		_init: function(){
			this._render();
		},
		_render: function(){
			this.canvas.drawArrow(20, 5, 5, 0, "#fff");
			this.canvas.drawText("  旋转", false, 35, 5, "#fff", 15);
			this.canvas.drawArrow(20, 5, 35, 90, "#fff");
			this.canvas.drawText("向右移动", false, 35, 35, "#fff", 15);
			this.canvas.drawArrow(20, 5, 65, -90, "#fff");
			this.canvas.drawText("向左移动", false, 35, 65, "#fff", 15);
			this.canvas.drawArrow(20, 5, 95, 180, "#fff");
			this.canvas.drawText("加速下落", false, 35, 95, "#fff", 15);
		}
	};

	window.Help = Help;
})(window);