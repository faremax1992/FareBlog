(function(){
	//主图切换
	var $mainImg = $('#main_img');
	var $largeImg = $('#large_img');
	var $chooseImgs = $(".main_left .choose span");
	$chooseImgs.bind("click", function(){
		$chooseImgs.removeClass("selected");
		$(this).addClass("selected");
		$mainImg.attr("src", $(this).find("img").attr("src"));
		$largeImg.attr("src", $(this).find("img").attr("src"));
	});

	//表单单选
	//颜色
	var $colorLi = $(".f_color li");
	var $colors = $(".f_color input");
	var now = 0;
	for(var i = 0; i < $colors.length; i++)
		$colors.eq(i).attr("index", i);
	$colors.bind("change", function(){
		$colorLi.removeClass("selected");
		$chooseImgs.removeClass("selected"); //主图下方选项清除
		if($(this).prop("checked")){
			$colors.prop("checked", false);//多选框模拟单选框
			$(this).prop("checked", true)
			$colorLi.eq($(this).attr("index")).addClass("selected");
			$mainImg.attr("src", $colorLi.eq($(this).attr("index")).find("img").attr("src")); //主图变换
			$largeImg.attr("src", $colorLi.eq($(this).attr("index")).find("img").attr("src")); 
		}
	});

	//套餐
	var $suitLi = $(".f_suit li");
	var $suits = $(".f_suit input");
	var now = 0;
	for(var i = 0; i < $suits.length; i++)
		$suits.eq(i).attr("index", i);
	$suits.bind("change", function(){
		$suitLi.removeClass("selected");
		if($(this).prop("checked")){
			$suits.prop("checked", false);
			$(this).prop("checked", true)
			$suitLi.eq($(this).attr("index")).addClass("selected");
		}
	});

	//分期
	var $payLi = $(".f_pay li");
	var $pays = $(".f_pay input");
	var now = 0;
	for(var i = 0; i < $pays.length; i++)
		$pays.eq(i).attr("index", i);
	$pays.bind("change", function(){
		$payLi.removeClass("selected");
		if($(this).prop("checked")){
			$pays.prop("checked", false);
			$(this).prop("checked", true)
			$payLi.eq($(this).attr("index")).addClass("selected");
		}
	});
}());