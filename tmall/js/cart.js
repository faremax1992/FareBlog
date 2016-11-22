(function(){

	//把全选映射到每个店铺
	var $selAll = $(".select_all");
	var $shopAll = $(".this_shop");
	var $selOnes = $(".select_one");
	var selShopOnes = []; //存放每个店铺的商品，以店铺为单位
	$selAll.bind("change", function(){
		$selOnes.prop("checked", $(this).prop("checked"));
		$shopAll.prop("checked", $(this).prop("checked"));
		$selAll.prop("checked", $(this).prop("checked"));
	});
	//把每个店铺全选映射到改店铺商品
	for(var i = 1; i <= $shopAll.length; ++i){
		selShopOnes.push($(".shop" + i));
		$shopAll.eq(i - 1).attr("index", i - 1); //为shopAll添加索引
	} 
	for(var i = 0; i < $selOnes.length; ++i){ //为selOnes添加索引
		$selOnes.eq(i).attr("index", i);
	} 
	$shopAll.bind("change", function(){
		var allTrue;
		selShopOnes[$(this).attr("index")].prop("checked", $(this).prop("checked"));
		//如果所有店铺都为checked，那么自动勾选“全选”
		allTrue = isAllTrue($shopAll);
		$selAll.prop("checked", allTrue);
	});
	//如果同一店铺每个商品都选中了，自动勾选该店铺的checkbox
	$selOnes.bind("change", function(e){
		var idx, allTrue;
		for(var i = 1; i <= $shopAll.length; ++i){
			if($(this).hasClass("shop" + i)){
				idx = i - 1;
				break;
			}
		}
		allTrue = isAllTrue(selShopOnes[idx]);
		$shopAll.eq(idx).prop("checked", allTrue);
		allTrue = isAllTrue($shopAll);
		$selAll.prop("checked", allTrue);
	});
	//计算勾选商品总价和总数
	var $checkboxes = $(".select_all").add(".this_shop").add(".select_one");
	var $selPrice = $(".sel_price");
	var $kindPrice = $(".kind_price");
	var sumPrice = 0;
	var $selCount = $("#sel_count");
	var selCount = 0;
	$checkboxes.bind("change", function(){
		$selOnes.each(function(i, x){
			if(x.checked) {
				selCount++;//计算勾选商品总数
				sumPrice += parseFloat($kindPrice.eq($(x).attr("index")).text().slice(1));//计算勾选商品总价
			}
		});
		$selCount.text(selCount);
		$selPrice.text(sumPrice.toFixed(2));
		selCount = 0;
		sumPrice = 0;
	});
	//每个商品数量增减
	var $minus = $(".minus");
	var $plus = $(".add");
	var $numOnes = $(".obj_num");
	var $onePrice = $(".price_new");
	//添加索引
	for(var i = 0; i < $plus.length; ++i){
		$minus.eq(i).attr("index", i);
		$plus.eq(i).attr("index", i);
		$numOnes.eq(i).attr("index", i);
		//清除初值为1的减号
		$minus.each(function(i, x){
			if($numOnes.eq(i).val() == 1) x.value = "";
		})
	}
	//计算每个商品总价
	function calcOne(){
		$onePrice.each(function(i, x){
			var num = parseFloat(x.innerHTML.slice(1));
			var sign = x.innerHTML.slice(0, 1);
			num = num * parseInt($numOnes.eq(i).val());
			$kindPrice.eq(i).text(sign + num.toFixed(2));
		})
	}
	calcOne();

	$plus.bind("click", function(){
		var idx = $(this).attr("index")
		var current = $numOnes.eq(idx).val();
		if(current == 1) $minus.eq(idx).val("-"); //显示减号
		$numOnes.eq(idx).val(++current);
		//修改该商品价格 单价*数量=总价
		calcOne();
		$selOnes.each(function(i, x){
			if(x.checked) {
				sumPrice += parseFloat($kindPrice.eq($(x).attr("index")).text().slice(1));//计算勾选商品总价
			}
		});
		$selPrice.text(sumPrice.toFixed(2));
		sumPrice = 0;
	});
	$minus.bind("click", function(){
		var idx = $(this).attr("index")
		var current = $numOnes.eq(idx).val();
		if(current > 1) --current;
		$numOnes.eq(idx).val(current); 
		if(current == 1) $(this).val(""); //隐藏减号
		//修改该商品价格 单价*数量=总价
		calcOne();
		$selOnes.each(function(i, x){
			if(x.checked) {
				sumPrice += parseFloat($kindPrice.eq($(x).attr("index")).text().slice(1));//计算勾选商品总价
			}
		});
		$selPrice.text(sumPrice.toFixed(2));
		sumPrice = 0;
	});
	$numOnes.bind("blur", function(){
		calcOne();
		$selOnes.each(function(i, x){
			if(x.checked) {
				sumPrice += parseFloat($kindPrice.eq($(x).attr("index")).text().slice(1));//计算勾选商品总价
			}
		});
		$selPrice.text(sumPrice.toFixed(2));
		sumPrice = 0;
	});
	function isAllTrue($obj){
			try{
				$obj.each(function(i, x){
					if(!x.checked) throw("notAllTrue");
				});
				return true;
			}catch(e){
				return false;
			}
		}
}());
	
//每个物品的删除
function deleteItem(idSel){
	var $del = $("#" + idSel);
	var $tr = $del.parents("tr");
	if($tr.find("tr").length === 1)
		$tr.remove();
	else
		$del.remove();
	console.log($("dsfasafdsafsafds"));
	if(!$(".shop").length) $("#empty_info").show();
	else $("#empty_info").hide();
}
//删除选中物品
function deleteSeleted(){
	var delItem = document.getElementsByClassName('del_item');
	var $selOnes = $(".select_one");
	for(var i = $selOnes.length; i >= 0; i--){
		if($selOnes.eq(i).prop("checked")) delItem[i].click();
	}
	$(".sel_price").text("0.00");
	$("#sel_count").text("0");
	$(".select_all").prop("checked", false);
}





























