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

  //模拟下拉菜单
  var $output = $('#remark_filter :text');
  var $orderUL = $('#remark_filter ul');
  $output.hover(function(){
    $orderUL.show();
  },function(){
    $orderUL.hide();
  });
  $orderUL.hover(function(){
    $orderUL.show();
  },function(){
    $orderUL.hide();
  });
  $orderUL.find("li").click(function(){
    $output[0].value = $(this).html();
    $output[0]["data-value"] = $(this).attr("data-value");
    $orderUL.hide();
  });

  //切换选项卡
  var $tabs = $("#tab_main .tab_detail");
  $("#tab_part .tab").click(function(){
    $("#tab_part .tab").removeClass("selected");
    $tabs.removeClass('selected_detail');
    $(this).addClass('selected');
    var idx = $(this).index();
    $tabs.eq(idx).addClass('selected_detail');
  })

  //如果没有追评就不显示完整子表格
  var $secContent = $("#remarks_table .sec_content");
  $secContent.each(function(){
    var $thisInnerTable = $('#remarks_table .inner_table').eq($secContent.index(this));
    if(this.innerHTML.replace(/\s*/g, "") === ""){
      $thisInnerTable.find("td:not('.fir_content')").addClass('none');
    } else{
      $thisInnerTable.find("td.fir_content>time").hide();
    }
  })

  //点击评论中图片放大缩小
  $('#remarks_table li').click(function(){
    $(this).parents().eq(1).find(">img").attr("src", $(this).find('img').attr("src")).slideDown('300');
    $(this).addClass('on').siblings().removeClass('on');
  });
  $('#remarks_table .remark_pic_enlarge').click(function(){
    $(this).slideUp();
  });

  //评论筛选
  var $remarkRadio = $('#remark_filter :radio');
  var $hasValue = $('#has_content');
  var $trs = $('#remarks_table .remark_item');
  hasRemark();
  $hasValue.click(hasRemark);

  $remarkRadio.click(function(){
    var now = $(':checked').eq(4).val();
    switch(now){
      case "all":
        $trs.show();
        hasRemark();
        break;
      case "remark":
        $trs.show().each(function(){
          if($(this).find('.sec_content').html().replace(/\s*/g,"") === ""){
            $(this).hide();
          }
        });
        hasRemark();
        break;
      case "picture":
        $trs.show().each(function(){
          console.log($(this).find('.person_main img'));
          if($(this).find('.person_main img').length === 0){
            $(this).hide();
          }
        });
        hasRemark();
        break;
      default: break;
    }
  });

  function hasRemark(){
    if($hasValue[0].checked){
      $trs.each(function(){
        if($(this).find('.fir_content').text() === ""){
          $(this).hide();
        }
      });
    } else {
      $trs.each(function(){
        if($(this).find('.fir_content').text() === ""){
          $(this).show();
        }
      });
    }
  }
  // console.log($remarkRadio);
}());

















