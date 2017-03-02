(function(window){
	"use strict";
	
	function Tetris(){
		this.board = new Board(this);
		this.score = new Score();
		this.timer = new Timer();
		this.level = new Level();
		this.nextShape = new NextShape();
		this.highScore = new HighestScore();
		this.help = new Help();
		
		this._sound;
		this._state = 'playing';
		(new Keyboard()).init(this.board);
	}
	
	Tetris.prototype = {
		constructor: Tetris,
		
		_startTick: function(){
			var _this = this;
			TetrisConfig.timer = setInterval(function(){
				_this.board.tick();
			}, TetrisConfig.speed);
		},
		
		_stopTick: function(){
			clearInterval(TetrisConfig.timer);
		},
		
		_initAudio: function(){
			this._sound = new Howl({
				src: ['sound/bg.wav'],
				loop: true,
				volume: 0.3
			});
			TetrisConfig.muted = localStorage.getItem("sound-muted") || false;
			if(TetrisConfig.mute === false){
				this.audioPlay();
			}
		},
		audioPlay: function(){
			if(this._state === "paused"){
				return;
			}
			TetrisConfig.muted = false;
			localStorage.setItem("sound-muted", 0);
			this._sound.play();
		},
		mute: function(){
			if(this._state === "paused"){
				return;
			}
			TetrisConfig.muted = true;
			localStorage.setItem("sound-muted", 1);
			this._sound.pause();	
		},
		restart: function(){
			this.endGame();
			this._state = "playing";
			this.timer.init(true);
			this.level.init(true);
			this.score.init(true);
			this.board.cleanUp();
			$('game-over').hide();
			this.startGame();
		},
		pause: function(){
			if(this._state === "over") {
				return;
			}
			this._sound.pause();
			this._state = "paused";
			this._stopTick();
			this.timer.pause();
		},
		resume: function(){
			if(this._state === "over") {
				return;
			}
			if(TetrisConfig.muted === false) {
				this._sound.play();
			}
			this._state = "playing";
			this._startTick();
			this.timer.resume();
		},
		startGame: function(){
			this._startTick();
			this._initAudio();
		},
		endGame: function(){
			this._sound.stop();
			this._stopTick();
			this.timer.stop();
		},
		showGrid: function(){
			if(this._state === "paused"){
				return;
			}
			TetrisConfig.grid = true;
			localStorage.setItem("game-grid", 1);
		},
		hideGrid: function(){
			if(this._state === "paused"){
				return;
			}
			TetrisConfig.grid = false;
			localStorage.setItem("game-grid", 0);
		}
	};
	
	window.Tetris = Tetris;
})(window);


