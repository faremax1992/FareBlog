(function(window){
	
	var cacheMap = new Map();
	var resourceTotalCount = 1;
	var currentLoaded = 0;
	var isAddLoaded = function(){
		currentLoaded++;
		if(currentLoaded === resourceTotalCount && typeof window.resourceManager.onResourceLoaded === "function"){
			window.resourceManager.onResourceLoaded();
		}
	};
	
	var init = function(){
		var image = new Image();
		image.onload = function(){
			cacheMap.set("blocks", image);
			isAddLoaded();
		};
		image.src = 'images/blocks.png';
	};
	var getResource = function(key){
		return cacheMap.get(key);
	};
	
	window.resourceManager = {
		getResource: getResource,
		init: init,
		onResourceLoaded: null
	}
	
})(window);
