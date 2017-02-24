(function($){
  $(function(){
    setTimeout(function(){
      $("#context").fadeIn(700);
    }, 300);
  });

  $('a[href^=http]').attr("target", "_blank");
})($);
