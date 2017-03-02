(function(window){
	"use strict";
	function Timer(){
		this.canvas = new Canvas("timer", 100, 70);
		this.time = 0;
		this.timeId;
		this.init(false);
	}
	
	Timer.prototype = {
		constructor: Timer,
		init: function(isDeep){
			if(isDeep){
				this.time = 0;
			}
			this._render();
			this._timerStart();
		},
		_timerStart(){
			var _this = this;
			this.timerId = setInterval(function(){
				_this.time++;
				_this._render();
			}, 1000);
		},
		_format(seconds){
			var hours = Math.floor(seconds / 3600);
			seconds = seconds - hours * 3600;
			var minutes = Math.floor(seconds / 60);
			seconds = seconds - minutes * 60;
			if(hours  < 10){
				hours = "0" + hours;
			}
			if(minutes < 10){
				minutes = "0" + minutes;
			}
			if(seconds < 10){
				seconds = "0" + seconds;
			}
			return hours + ":" + minutes + ":" + seconds;
		},
		_render: function(){
			this.canvas.drawText(this._format(this.time), true);
		},
		pause: function(){
			clearInterval(this.timerId);
		},
		resume: function(){
			this._timerStart();
		},
		stop: function(){
			clearInterval(this.timerId);
		}
	};
	
	window.Timer = Timer;
})(window);
