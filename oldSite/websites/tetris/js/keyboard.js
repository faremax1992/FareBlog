(function(window){
	"use strict";
	var keys = {
		37: "left",
		38: "top",
		39: "right",
		40: "down"
	};
	
	function Keyboard(){
		this.board;
	}
	
	Keyboard.prototype = {
		constructor: Keyboard,
		init: function(board){
			var _this = this;
			this.board = board;
			document.addEventListener("keydown", function(e){
				_this.processKeyDown(e);
			}, false);
		},
		processKeyDown: function(e){
			if(this.board.gameInst._state !== 'playing'){
				return;
			}
			if(keys[e.keyCode]){
				this.press(keys[e.keyCode]);
			}
		},
		press: function(keys){
			var refresh = false;
			var [offsetX, offsetY]= [0, 0];
			switch(keys){
				case 'top': 
					if(this.board.shape.width < this.board.shape.height){
						offsetX = this.board.shape.height - this.board.shape.width;
						offsetY = 0;
					} else {
						offsetY = this.board.shape.width - this.board.shape.height;
						offsetX = 0;
					}
					
					if(this.board.validMove(offsetY, offsetX)){
							this.board.shape.rotate();
							[this.board.shape.width, this.board.shape.height] = [this.board.shape.height, this.board.shape.width];
							refresh = true;
					}
					break;
				case 'right': 
					if(this.board.validMove(1, 0)){
						this.board.shape.x++;
						refresh = true;
					}
					break;
				case 'down': 
					if(this.board.validMove(0, 1)){
						this.board.shape.y++; 
						refresh = true;
					}
					break;
				case 'left': 
					if(this.board.validMove(-1, 0)){
						this.board.shape.x--; 
						refresh = true;
					}
					break;
				default: break;
			}
			if(refresh){
				this.board.refresh();
				this.board.shape.draw(this.board.context);
				if(keys === "down"){
					var _this = this;
					clearInterval(TetrisConfig.timer);
					TetrisConfig.timer = setInterval(function(){
						_this.board.tick();
					}, TetrisConfig.speed);
				}
			}
		}
	};
	
	window.Keyboard = Keyboard;
})(window);
