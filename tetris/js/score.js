(function(window){
	"use strict";
	function Score(){
		this.canvas = new Canvas("score", 100, 70);
		this.score = 0;
		this.init();
	}
	
	Score.prototype = {
		constructor: Score,
		init(isDeep){
			if(isDeep){
				this.score = 0;
			}
			this._render();
		},
		_render: function(){
			this.canvas.drawText(this.score);
		},
		addScore: function(value){
			this.score += value;
			this._render();
			return this.score;
		}
	};
	
	window.Score = Score;
})(window);
