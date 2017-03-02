(function(window){
	'use strict';
	var shapeLayouts = [
		[ [0, 1, 0], [1, 1, 1] ],
		[ [1, 0], [1, 1], [1, 0] ],
		[ [1, 1, 1], [0, 1, 0] ],
		[ [0, 1], [1, 1], [0, 1] ],
		[ [1, 0], [1, 1], [0, 1] ],
		[ [0, 1, 1], [1, 1, 0] ],
		[ [0, 1], [1, 1], [1, 0] ],
		[ [1, 1, 0], [0, 1, 1] ],
		[ [1, 1], [1, 1] ],
		[ [1], [1], [1], [1] ],
		[ [1, 1, 1, 1] ],
		[ [1, 0, 0], [1, 1, 1] ],
		[ [1, 1, 1], [0, 0, 1] ],
		[ [0, 0, 1], [1, 1, 1] ],
		[ [1, 1, 1], [1, 0, 0] ],
		[ [1, 0], [1, 0], [1, 1] ],
		[ [0, 1], [0, 1], [1, 1] ],
		[ [1, 1], [1, 0], [1, 0] ],
		[ [1, 1], [0, 1], [0, 1] ]
	];
	var styleCount = 7;
	
	function Shape(){
		var num = this._random(1, styleCount);
		this.block = new Block(num);  //intager from set [1, 8)
		this.x = 0;
		this.y = 0;
		
		this.layout = shapeLayouts[this._random(0, shapeLayouts.length)];
		
		this.width = this.layout.length;
		this.height = this.layout[0].length;
	}
	
	Shape.prototype = {
		constructor: Shape,
		draw: function(context, size){
			for(var i = 0; i < this.layout.length; i++){
				for(var j = 0; j < this.layout[i].length; j++){
					if(this.layout[i][j]){
						this.block.draw(context, j + this.x, i + this.y, undefined, size);
					}
				}
			}
		},
		rotate: function(){
			var newLayout = [];
			for(var y = 0; y < this.layout[0].length; y++){
				newLayout[y] = [];
				for(var x = 0; x < this.layout.length; x++){
					newLayout[y][x] = this.layout[this.layout.length - 1 - x][y];
				}
			}
			this.layout = newLayout;
			this._setLayout();
		},
		_setLayout(){
			if(this.x < 0){
				this.x = 0;
			}
			if(this.y < 0){
				this.y = 0;
			}
			if(this.x + this.layout[0].length > 13){
				this.x = TetrisConfig.cols - this.layout[0].length;
			}
			if(this.y + this.layout.length > 20){
				this.y = TetrisConfig.rows - this.layout.length;
			}
		},
		_random(minValue, maxValue){
			return minValue + Math.floor(Math.random() * maxValue);
		},
		getMaxCols: function(){
			var max = 0;
			for(var i = 0; i <this.layout.length; i++){
				max = Math.max(max, this.layout[i].length);
			}
			return max;
		},
		getMaxRows: function(){
			return this.layout.length;	
		},
		
		setPosition: function(cols, rows, ignoreRows){
			this.x = Math.floor((cols - this.getMaxCols()) / 2);
			if(!ignoreRows){
				this.y = Math.floor((rows - this.getMaxRows()) / 2);
			} else {
				this.y = this.y - 1;
			}
		}
	};
	
	window.Shape = Shape;
})(window);
