(function(document){
	"use strict";
	
	var gameInst;
	
	$('#btn-start').click(function(){
		$('.start-container').hide();
		$('.game-container').show();
		startGame();
	});

	$('#btn-game-pause').click(function(){
		var $btn = $('#btn-game-pause');
		if($btn.text() === "暂停"){
			$btn.text('继续');
			gameInst.pause();
		} else {
			$btn.text('暂停');
			gameInst.resume();
		}
	});
	
	$('#btn-game-restart').click(function(){
		gameInst.restart();
	});
	
	function toggleSound(){
		if(!TetrisConfig.muted){
			gameInst.mute();
		} else {
			gameInst.audioPlay();
		}
	}
	$('#btn-game-mute').click(toggleSound);
	$('#btn-mute').click(toggleSound);
	
	$('#btn-game-grid').click(function(){
		if(TetrisConfig.grid){
			gameInst.hideGrid();
		} else {
			gameInst.showGrid();
		}
	});
	
	
	function startGame(){
		$('#game-over').hide();
		resourceManager.onResourceLoaded = function(){
			gameInst = new Tetris()
			gameInst.startGame();
		};
		resourceManager.init();
	}
	
})(document);
