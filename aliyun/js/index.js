(function(document){
  //top bar
  var ll = document.getElementsByClassName('ll');
  var fl1 = ll[0].getElementsByClassName('first_list');
  var fl2 = ll[1].getElementsByClassName('first_list');
  var sl = fl1[0].getElementsByClassName('second_list');
  var dls = document.getElementsByClassName('detail');
  var previous_1 = [], previous_2 = [], previous_3 = [];

  for(var i = 0; i < fl1.length; i++){
    fl1[i].onmouseover = (function(i){
      return function(){
        var j;
        for(var j = 0; j < fl1.length; j++)
          fl1[j].className = fl1[j].className.replace(/\b ?on\b/g, "");
        this.className += " on";
        if(previous_1.className)
          previous_1.className = previous_1.className.replace(/\b ?on\b/g, "");
        var dl = fl1[i].getElementsByClassName("detail");
        dl[0].className += " on";
        previous_1 = dl[0];
      }
    })(i);
  }

  for(var i = 0; i < fl2.length; i++){
    fl2[i].onmouseover = (function(i){
      return function(){
        var j;
        for(var j = 0; j < fl2.length; j++)
          fl2[j].className = fl2[j].className.replace(/\b ?on\b/g, "");
        this.className += " on";
        if(previous_3.className)
          previous_3.className = previous_3.className.replace(/\b ?on\b/g, "");
        var dl = fl2[i].getElementsByClassName("detail");
        dl[0].className += " on";
        previous_3 = dl[0];
      }
    })(i);
  }

  for(var i = 0; i < sl.length; i++){
    sl[i].onmouseover = (function(i){
      return function(){
        var j;
        for(var j = 0; j < sl.length; j++)
          sl[j].className = sl[j].className.replace(/\b ?on\b/g, "");
        this.className += " on";
        if(previous_2.className)
          previous_2.className = previous_2.className.replace(/\b ?on\b/g, "");
        var dl = sl[i].getElementsByClassName("detail");
        dl[0].className += " on";
        previous_2 = dl[0];
      }
    })(i);
  }

  init();

  function init(){
    previous_1 = fl1[0].children[0];
    previous_3 = fl2[0].children[0];
    previous_2 = sl[0].children[0];
  }

  //banner
  var $ppt = $(".ban_content");
  var $pptDot = $("#ban_rect span");
  $ppt.first().fadeIn(500);
  $pptDot.first().animate({opacity: "1"}, {duration: 500});

  var num = 0, timer;
  function pptAuto(){
    timer = setInterval(function(){
      $pptDot.eq(num).animate({opacity: ".5"}, {duration: 300});
      $ppt.eq(num).hide();
      if(++num >= $ppt.length) num -= $ppt.length;
      $pptDot.eq(num).animate({opacity: "1"}, {duration: 500});
      $ppt.eq(num).fadeIn(500);
    }, 1500);
  }
  pptAuto();

  $(".banner").eq(0).hover(function(){
    clearInterval(timer);
  }, function(){
    pptAuto();
  });

  $pptDot.click(function(){
    $pptDot.eq(num).animate({opacity: ".5"}, {duration: 300});
    $ppt.eq(num).hide();
    num = $(this).index();
    $pptDot.eq(num).animate({opacity: "1"}, {duration: 500});
    $ppt.eq(num).fadeIn(500);
  });

  //service
  var $flags = $(".service .flag");
  var $flag_on = $flags.eq(0);
  $flag_on.animate({width: "360px"},{duration: 0});
  $flag_on.addClass('ser_hov');

  $flags.bind("mouseover", serMouse);

  function serMouse(){
    if(this.className.indexOf("ser_hov") === -1){
      // $flags.unbind();
      $(this).find("ul").hide();
      $(this).find(".s_head img").attr("src", $(this).find(".s_head img").attr("src").replace(/_1/, "_2"));
      $flag_on.find(".s_head img").attr("src", $flag_on.find(".s_head img").attr("src").replace(/_2/, "_1"));
      $flag_on.animate({width: "264px"},{duration: 300});
      $flag_on.removeClass('ser_hov');
      $flag_on = $(this);
      $flag_on.animate({width: "360px"},{duration: 300});
      $flag_on.addClass('ser_hov');
      $(this).find("ul").fadeIn(500);
      // setTimeout(function(){$flags.bind("mouseover", serMouse);}, 100);
    }
  }


  //solve
  // $solMask = $(".solve .sol_flag .mask");
  // $solMask.mouseover(function(){
  //   console.log(this);
  //   $(this).animate({"background-color": "#aaa"},{duration: 300});
  // })


})(document)