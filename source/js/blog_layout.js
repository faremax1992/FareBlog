(function(){
  var onloadFun;
  if(document.body.onload){
    onloadFun = document.body.onload;
  }
  if(isBrowser()){
    // 防止原有 onload 被覆盖
    // 定义滑动效果
    document.body.onload = function(){
      if(onloadFun){
        onloadFun();
        onloadFun = null;
      }
      // 定义滑动效果
      var $title = $('#top');
      var $slogan = $('#slogan');
      var $sidebar = $('#sidebar');
      var $sidebarFooter = $('#sidebar-footer');
      var titleOffset = getAbsoluteOffset($title);
      var sidebarOffset = getAbsoluteOffset($sidebar);
      // 窗口大小调整时重新计算距离
      $(window).on('resize', function(){
        titleOffset = getAbsoluteOffset($slogan);
        sidebarOffset = getAbsoluteOffset($sidebarFooter);
        $(this).trigger('scroll');
      });

      $(window).on('scroll', function(e){
        var scrollTop = document.body.scrollTop;

        // 顶部小标题
        if(scrollTop <= titleOffset.top){
          $slogan.css('opacity', 1 - parseInt(scrollTop) / titleOffset.top);
        }

        // 顶部大标题
        if(scrollTop >= titleOffset.top){
          $('.blog-masthead').addClass('scroll');
          $title.css('paddingLeft', titleOffset.left);
        } else{
          $('.blog-masthead').removeClass('scroll');
          $title.css('paddingLeft', 0);
        }

        // 侧边栏
        if(scrollTop + 68 >= sidebarOffset.top){
          $sidebar.addClass('scroll');
          $sidebar.css('left', sidebarOffset.left);
        } else {
          $sidebar.removeClass('scroll');
          $sidebar.css('left', 0);
        }
      });
    }
  }
  if(document.body.onload){
    onloadFun = document.body.onload;
  }
  document.body.onload = function(){
    if(onloadFun){
      onloadFun();
      onloadFun = null;
    }
    var $navBar = $('#navbar');console.log($navBar);
    var $btn = $('#nav-btn-fw');console.log($btn);
    var $fw  = $btn.find('i');console.log($fw);
    $btn.on('click', function(){
      if(!$navBar.hasClass('in')){
        $fw.removeClass('fa-chevron-down').addClass('fa-chevron-up');
      } else {
        $fw.removeClass('fa-chevron-up').addClass('fa-chevron-down');
      }
    });
  }

  // 计算元素相对于 document 的绝对偏移
  function getAbsoluteOffset($ele){
    var offset = {
      left: -parseInt($ele.css('borderLeftWidth')),
      top: -parseInt($ele.css('borderTopWidth'))
    };
    var curr  = $ele;
    do{
      offset.top += parseInt(curr.prop('offsetTop'));
      offset.left += parseInt(curr.prop('offsetLeft'));
      offset.top += parseInt(curr.css('borderTopWidth'));
      offset.left += parseInt(curr.css('borderLeftWidth'));
      curr = $(curr.prop('offsetParent'));
    }while(curr.length);
    return offset;
  }

  // 判断是否浏览器
  function isBrowser(){
    if (!screen || document.body.offsetWidth < 768) {
      return false;
    } else if(/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent)){
     return false;
    }
    return true;
  }
})()


// function getDetail(obj){
//   for(var key in obj){
//     if(obj.hasOwnProperty(key)){
//       console.log(key + ': ' + obj[key]);
//     }
//   }
// }
