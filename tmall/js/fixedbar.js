(function(){
  //right bar
  var $verSpan = $("#ver_bar>span");
  var $vDetail = $(".v_detail");
  $verSpan.hover(function(){
    var num = $verSpan.index(this);
    var offset = num >= 5 ? 2 : 1;
    if(num == 11) $vDetail.eq(9).show().animate({"right": "31px"}, {duration: "fast"});
    else if(num != 0 && num != 4) $vDetail.eq(num - offset).show().animate({"right": "35px"}, {duration: "fast"});

  },
  function(){
    $vDetail.animate({"right": "55px"}, {duration: 0}).hide();
  });

  //top bar
  console.log($("body"));
  $("body")[0].onscroll = function(){
    console.log($("body")[0].scrollTop > window.screen.height)
    if($("body")[0].scrollTop > window.screen.height)
      $("#top_search").animate({"top": "0px"}, {duration: "fast", queue: false});
    else
      $("#top_search").animate({"top": "-50px"}, {duration: "fast", queue: false});
  }
}());
