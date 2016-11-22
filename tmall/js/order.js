(function(){
	//计算运费险
	var $isExp = $(".is_exp");
	var $expKind = $(".exp_kind");
	var $safePrice = $(".safe_price");
	var $shopAll = $(".shop_all");
	var $message = $(".message");
	for(var i = 0; i < $isExp.length; ++i) {
		$isExp.eq(i).attr("index", i);
		$expKind.eq(i).attr("index", i);
		$message.eq(i).attr("index", i);
	}

	$isExp.bind("change", function(){
		console.log($(this));
		var idx = $(this).attr("index");
		var oldValue = parseFloat($safePrice.eq(idx).text());
		var newValue;
		if(!$(this).prop("checked"))
			newValue = 0;
		else
			newValue = parseFloat($expKind.eq(idx).find(":checked").val());
		$safePrice.eq(idx).text(newValue.toFixed(2));
		$shopAll.eq(idx).text((parseFloat($shopAll.eq(idx).text()) + newValue - oldValue).toFixed(2));
		calcAllPrice();
	});

	$expKind.bind("change", function(){
		var idx = $(this).attr("index");
		if($isExp.eq(idx).prop("checked")){
			var oldValue = parseFloat($safePrice.eq(idx).text());
			var newValue = parseFloat($(this).find(":checked").val());
			$safePrice.eq(idx).text(newValue.toFixed(2));
			$shopAll.eq(idx).text((parseFloat($shopAll.eq(idx).text()) + newValue - oldValue).toFixed(2));
			calcAllPrice();
		}
	});

	var $shop = $(".shop");
	var $kindPrice = $(".kind_price");
	var objNum = [];
	var $expPrice = $(".exp_price");
	for(var i = 0; i < $shop.length; ++i)
		objNum.push($shop.eq(i).find("tr").length - 3);
	// debugger;
	//计算每个店铺的总价
	var idx = 0;
	for(var i = 0; i < $shopAll.length; ++i){
		var objSum = 0;
		var len = objNum.shift();
		for(var j = 0; j < len; j++){
			objSum += parseFloat($kindPrice.eq(idx++).text());
		}
		objSum += (parseFloat($expPrice.eq(i).text()) + parseFloat($safePrice.eq(i).text()));
		$shopAll.eq(i).text(objSum.toFixed(2));
		objSum = 0;
	}
	//计算订单总价
	function calcAllPrice(){
		var sumAll = 0;
		for(var i = 0; i < $shopAll.length; ++i)
			sumAll += parseFloat($shopAll.eq(i).text());
		$("#all_price").text(sumAll.toFixed(2));
	}
	calcAllPrice();

	//选地址
	var $selAddr = $(".addr");
	$selAddr.bind("click", function(){
		$selAddr.removeClass("selected");
		$(this).addClass("selected");
	});

	//textarea变化和统计
	var $wordNum = $(".word_num");
	var $current = $(".word_num .current");

	$message.bind("focus", function(){
		var idx = $(this).attr("index");
		$(this).attr("rows", "5");
		$wordNum.eq(idx).show();
	});
	$message.bind("blur", function(){
		var idx = $(this).attr("index");
		$(this).attr("rows", "1");
		$wordNum.eq(idx).hide();
	});
	$message.bind("input", function(){
		var idx = $(this).attr("index");
		$current.eq(idx).text($(this).val().length);
	});
}());











function changeName(showName, input, link){
		var $showName = $("#" + showName);
		var $input = $("#" + input);
		console.log($showName);
		console.log($input);
		$input.val($showName.text());
		$input.show();
		$showName.hide();
		$("#" + link).hide();
		$input.bind("blur", function(){
			$showName.text($input.val());
			$input.hide();
			$showName.show();
			$("#" + link).show();
		});
}