(function(window){
	"use strict";
	function HighestScore(){
		this.canvas = new Canvas("highest-score", 100, 70);
		this.highScore = 0;
		this._init();
	}
	
	HighestScore.prototype = {
		constructor: HighestScore,
		_init(){
			this.highScore = this._getScore();
			this._render();
		},
		_render: function(){
			this.canvas.drawText(this.highScore, true);
		},
		_getScore: function(){
			return window.localStorage.getItem("high-score") || 0;
		},
		_setScore: function(value){
			window.localStorage.setItem("high-score", value);
		},
		checkScore: function(score){
			if(score > this.highScore)
				this.highScore = score;
				this._setScore(score);
				this._render();
		}
	};
	
	window.HighestScore = HighestScore;
})(window);
