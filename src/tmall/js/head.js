(function(){
	var $btn = $(".arrow").add(".noarrow");
	var $down = $(".down");

	var num = 0;
	var $arrow = $(".arrow:after");
	$down.hover(function(){
		$(this).css("display","block");
		var num = $down.index(this);
		if(num != 2) $btn.eq(num).addClass("harrow");
	},
	function(){
		$(this).css("display","none");
		var num = $down.index(this);
		if(num != 2) $btn.eq(num).removeClass("harrow");
	});

	$btn.hover(function(){
		if($btn.index(this) != 2) $(this).toggleClass("harrow");
		$down.eq($btn.index(this)).css("display","block");
	},
	function(){
		if($btn.index(this) != 2) $(this).toggleClass("harrow");
		$down.eq($btn.index(this)).css("display","none");
	});
}());