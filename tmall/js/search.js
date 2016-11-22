(function(){
	var $btn = $("#choices .btn");
	var $btnView = $("#choices .btn_view");
	setStyle($btn.eq(0));
	setStyle($btnView.eq(1));

	$btn.bind("click", function(){
		clearStyle($btn);
		setStyle($(this));
	});
	$btnView.bind("click", function(){
		clearStyle($btnView);
		setStyle($(this));
	});

	function setStyle($obj){
		$obj.css("backgroundColor", "#e0dcdb");
		$obj.css("color", "#af060f");
		var src = $obj.find("img").attr("src");
		src = src.replace(/1/g, "2");
		$obj.find("img").attr("src", src);
	}
	function clearStyle($obj){
		$obj.css("backgroundColor", "#fff");
		$obj.css("color", "#000");
		for(var i = 0; i < $obj.length; i++){
			var src = $($obj[i]).find("img").attr("src");
			src = src.replace(/\d/g, "1");
			$($obj[i]).find("img").attr("src", src);
		}	
	}

	var $wangwang = $(".openwangwang");
	$wangwang.attr("href", "http://www.taobao.com/webww/ww.php?ver=3&touid=%E6%94%BE%E9%A3%9E%E6%A2%A6%E6%83%B3in&siteid=cntaobao&status=1&charset=utf-8");
	$wangwang.attr("target", "_blank");

}());