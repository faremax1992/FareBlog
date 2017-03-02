(function(){
	var $mainImg = $('#main_img');
	var $moveRect = $('#mouse_move')
	var $largeImg = $('#large_img');
	var $showBig = $("#show_big");
	var $toBig = $("#to_big");

	$mainImg.bind("mouseover", function(){
		$moveRect.show();
		$showBig.show();
		window.onmousemove = function(e){
			var mouseX = e.pageX;
			var mouseY = e.pageY;
			var rectWidth = $moveRect.outerWidth();
			var rectHeight = $moveRect.outerHeight();
			var imgOffset = $mainImg.offset();
			var imgWidth = $mainImg.outerWidth();
			var imgHeight = $mainImg.outerHeight();
			var toBigOffset = $toBig.offset();

			$moveRect.css("left", mouseX - toBigOffset.left - rectWidth / 2);
			$moveRect.css("top", mouseY - toBigOffset.top - rectHeight / 2);

			if(mouseX - rectWidth / 2 <= imgOffset.left)
			 	$moveRect.css("left", imgOffset.left - toBigOffset.left);

			if(mouseY - rectHeight / 2 <= imgOffset.top)
				$moveRect.css("top", imgOffset.top - toBigOffset.top);

			if(mouseX + rectWidth / 2 >= imgOffset.left + imgWidth)
				$moveRect.css("left", imgOffset.left + imgWidth - rectWidth - toBigOffset.left)

			if(mouseY + rectHeight / 2 >= imgOffset.top + imgHeight)
				$moveRect.css("top", imgOffset.top + imgHeight - rectHeight - toBigOffset.top)

			if(mouseX > imgOffset.left + imgWidth ||
				mouseY > imgOffset.top + imgHeight ||
				mouseX < imgOffset.left ||
				mouseY < imgOffset.top
				){
				$moveRect.hide();
				$showBig.hide();
			}

			//计算比例
			var radioX = ($moveRect.offset().left - imgOffset.left) / imgWidth;
			var radioY = ($moveRect.offset().top - imgOffset.top) / imgHeight;

			$showBig.scrollLeft($largeImg.outerWidth() * radioX);
			$showBig.scrollTop($largeImg.outerHeight() * radioY);
		};
	});
	// $mainImg.bind("mouseleave", function(){
	// 	$moveRect.hide();
	// });
}())