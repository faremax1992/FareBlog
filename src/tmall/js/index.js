(function(){
	//ppt
	var $ppt = $(".ban_info");
	var $pptDot = $("#ban_circle span");
	$ppt.first().addClass("now");
	$pptDot.first().addClass("checked");
	var num = 0, timer;
	function pptAuto(){
		timer = setInterval(function(){
			$pptDot.eq(num).removeClass("checked");
			$ppt.eq(num).removeClass("now");
			if(++num >= $ppt.length) num -= $ppt.length;
			$pptDot.eq(num).addClass("checked");
			$ppt.eq(num).addClass("now");
		}, 3500);
	}
	pptAuto();

	$pptDot.hover(movein, moveout);
	
	function movein(){
		clearInterval(timer);
		$pptDot.removeClass("checked");
		$ppt.removeClass("now");
		this.className += " checked";
		num = $pptDot.index(this);
		$ppt.eq(num).addClass("now");
	}
	function moveout(){
		pptAuto();
	}

	//nav bar
	var $navHover = $(".hover");
	var $nav = $("nav li");
	$nav.hover(function(){
		var num = $nav.index(this);
		if(num != 0) $navHover.eq(num - 1).animate({"margin-top": "-13px"}, {duration: "fast"});
	},
	function(){
		$navHover.animate({"margin-top": "0px"}, {duration: 0});
	});

	//brands
	var $brEvent = $(".br_event");
	var $brands = $(".brand");
	$brEvent.hover(function(){
		var num = $brEvent.index(this);
		$brands.eq(num).fadeIn(300);
	},
	function(){
		$brands.hide();
	});
	var $brHeart = $(".br_heart");
	$brHeart.bind("click", function(){
		if($(this).attr("src").match(/heart1/)) $(this).attr("src", "img/br_heart2.png");
		else $(this).attr("src", "img/br_heart1.png");
	});

	var $kindRight = $(".kind_m_right div");
	$kindRight.hover(function(){
		$(this).find(".kind_obj").animate({right: "5px"},{duration: "fast"})
	},
	function(){
		$kindRight.find(".kind_obj").animate({right: "0px"},{duration: 0})
	});

	$(".kind_m_left").hover(function(){
		$(this).find(".kind_img img").fadeTo(300, 0.7);
	}, function(){
		$(this).find(".kind_img img").fadeTo(0, 1);
	});

	$('video').bind("click", function() {
		if ($(this).hasClass('pause')){
			$("video").trigger("play");
			$(this).removeClass('pause');
			$(this).addClass('play');
		} else {
			$("video").trigger("pause");
			$(this).removeClass('play');
			$(this).addClass('pause');
		}
	});
}());



























