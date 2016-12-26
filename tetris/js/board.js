(function(window){
	"use strick";
	
	function Board(gameInst){
		this.gameInst = gameInst;
		this.blockSize = 30;
		this.rows = TetrisConfig.rows;
		this.cols = TetrisConfig.cols;
		this.canvas = new Canvas("c-game-main", this.cols * this.blockSize, this.rows * this.blockSize);
		this.context = this.canvas.context;
		this.boardList = [];
		this.shape = new Shape();
		
		this._init();
	}
	
	Board.prototype = {
		constructor: Board,
		_init: function(){
			this._buildGridData();
			TetrisConfig.grid = localStorage.getItem("game-grid") || true;
			if(TetrisConfig.grid){
				this._initGrid();
			}
			this.shape.setPosition(this.cols, this.rows, true);
			this.shape.draw(this.context);
			var _this = this;
			setTimeout(function(){
				_this._buildNextShape();
			});
		},
		tick: function(){
			if(this.validMove(0,1)){
				this.shape.y++;
			} else {
				this.addShapeToBoardList();
				if(this.gameInst._state === 'over'){
					this.gameInst.endGame();
					return;
				}
				this.clearFullRows();
				this.shape = this.nextShape;
				this.shape.setPosition(this.cols, this.rows, true);
				this._buildNextShape();
			}
			this.refresh();
			this.shape.draw(this.context);
		},
		refresh: function(){
			this.canvas.clear();
			if(TetrisConfig.grid){
				if(this.gridImageData){
					this.context.putImageData(this.gridImageData, 0, 0);
				} else {
					this._initGrid();
				}
			}
			this.drawBlocks();
		},
		cleanUp:function(){
			this.canvas.clear();
			if(TetrisConfig.grid){
				if(this.gridImageData){
					this.context.putImageData(this.gridImageData, 0, 0);
				} else {
					this._initGrid();
				}
			}
			this.boardList = [];
			this._buildGridData();
			this.shape = new Shape();
			this.shape.setPosition(this.cols, this.rows, true);
			this.shape.draw(this.context);
			var _this = this;
			setTimeout(function(){
				_this._buildNextShape();
			});
		},
		validMove: function(moveX, moveY){
			var nextX = this.shape.x + moveX;
			var nextY = this.shape.y + moveY;
			for(var y = 0; y < this.shape.layout.length; y++){
				for(var x = 0; x < this.shape.layout[y].length; x++){
					if(this.shape.layout[y][x]){
						if(typeof this.boardList[nextY + y] === 'undefined' ||   //is not in line
						typeof this.boardList[nextY + y][nextX + x] === "undefined" ||   //  is not in column
						this.boardList[nextY + y][nextX + x] ||  //has a cube
						nextX + x < 0 ||  //overflow the left edge
						nextX + x >= this.cols ||  //overflow the right edge
						nextY + y >= this.rows){   //overflow the down edge
							return false;
						}
					}
				}
			}
			return true;
		},
		_isFull: function(){
			for(var i = 0; i < this.boardList[0].length; i++){
				if(this.boardList[0][i]){
					return true;
				}
			}
			return false;
		},
		addShapeToBoardList: function(){
			for(var y = 0; y < this.shape.layout.length; y++){
				for(var x = 0; x < this.shape.layout[y].length; x++){
					if(this.shape.layout[y][x]){
						console.log(x + " " + y);
						console.log(this.shape.x + " " + this.shape.y);
						var boardX = this.shape.x + x;
						var boardY = this.shape.y + y;
						console.log(boardX + " " + boardY);
						if(this._isFull()){
							//game over
							this.gameInst._state = "over";
							$('#game-over').show();
							return;
						} else {
							this.boardList[boardY][boardX] = this.shape.block.blockType;
						}
					}
				}
			}
		},
		drawBlocks: function(){
			for(var y = 0; y < this.rows; y++){
				for(var x = 0; x < this.cols; x++){
					if(this.boardList[y][x]){
						this.shape.block.draw(this.context, x, y, this.boardList[y][x]);
					}
				}
			}
		},
		createEmptyRow: function(){
			var emptyRow = [];
			for(var i = 0; i < this.cols; i++){
				emptyRow.push(0);
			}
			return emptyRow;
		},
		clearFullRows: function(){
			var lines = 0;
			for(var y = this.rows - 1; y >= 0; y--){
				var filled = this.boardList[y].filter(function(item){return item > 0}).length === this.cols;
				if(filled && y){
					this.boardList.splice(y, 1);
					this.boardList.unshift(this.createEmptyRow());
					lines++;
					y++;
				}
			}
			var score = lines * lines * 100;   //score
			var totalScore = this.gameInst.score.addScore(score);
			this.gameInst.highScore.checkScore(totalScore);
			
			var curLevel = this.gameInst.level.checkLevel(totalScore);
			if(curLevel){
				window.TetrisConfig.speed = Math.floor(TetrisConfig.constSpeed * (1 - (curLevel * 2 - 1) / 10));
				$('#level-up').show();
				setTimeout(function(){
					$('#level-up').hide();
				}, 2500);
			}
			
		},
		_buildNextShape(){
			this.nextShape = new Shape();
			this.nextShape.setPosition(this.gameInst.nextShape.cols, this.gameInst.nextShape.rows);
			this.gameInst.nextShape.render(this.nextShape);
			
		},
		_buildGridData(){
			var i, j;
			for(i = 0; i < this.rows; i++){
				this.boardList[i] = [];
				for(j = 0; j < this.cols; j++){
					this.boardList[i][j] = 0;
				}
			}
		},
		
		_initGrid(){
			var i;
			this.context.strokeStyle = "green";
			this.context.lineWidth = 0.5;
			//draw the grid
			for(i = 1; i < this.rows; i++){
				this.context.moveTo(0, i * this.blockSize);
				this.context.lineTo(this.canvas.width, i * this.blockSize)
				
			}
			for(i = 1; i < this.cols; i++){
				this.context.moveTo(i * this.blockSize, 0);
				this.context.lineTo(i * this.blockSize, this.canvas.height)
			}
			this.context.stroke();
			
			this.gridImageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
		}
	}
	window.Board = Board;
})(window);
