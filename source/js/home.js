(function(){

  // 主页动画
  if(isBrowser()){
    animate(15);   // 图片晃动偏移 15px
  } else {
    $(document).unbind('mousemove');   //否则注销事件
  }

  // 定义动画
  function animate(maxOffset){
    var $imgs = $('.pc-bg-img');
    var tops = [], lefts = [], rands = [];
    for(var i = 0, len = $imgs.length; i < len; i++){
      tops.push($imgs.eq(i).css('top'));
      lefts.push($imgs.eq(i).css('left'));
      rands.push(Math.random() * 0.5 + 1);
    }
    $(document).bind('mousemove', function(e) {
      e = e || window.event;

      // 将鼠标移动范围映射到图片移动范围
      var halfHeight = document.body.offsetHeight / 2;
      var halfWidth = document.body.offsetWidth / 2;
      var moveX = (e.clientX - halfWidth) / halfWidth;
      var moveY = (e.clientY - halfHeight) / halfHeight;

      // 图片晃动变化
      $imgs.eq(0).css('left', parseInt(lefts[0]) + maxOffset * moveX * rands[0] + 'px');
      $imgs.eq(0).css('top', parseInt(tops[0]) + maxOffset * moveY * rands[0] + 'px');
      $imgs.eq(1).css('left', parseInt(lefts[1]) - maxOffset * moveX * rands[1] + 'px');
      $imgs.eq(1).css('top', parseInt(tops[1]) - maxOffset * moveY * rands[1] + 'px');
      $imgs.eq(2).css('left', parseInt(lefts[2]) - maxOffset * moveX * rands[2] + 'px');
      $imgs.eq(2).css('top', parseInt(tops[2]) + maxOffset * moveY * rands[2] + 'px');
      $imgs.eq(3).css('left', parseInt(lefts[3]) + maxOffset * moveX * rands[3] + 'px');
      $imgs.eq(3).css('top', parseInt(tops[3]) - maxOffset * moveY * rands[3] + 'px');
    });
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
})();













// var canvas = document.createElement('canvas');
//     canvas.width = 1920;
//     canvas.height = 1079;
//     var imgs = [];
//     var baseUrl = "img/bg_";
//     var pic_num = 4;
//     var loaded = 0;
//     var sWidth = screen.availWidth;
//     var sHeight = screen.availHeight;
//     var timer = setInterval(function(){
//       if(loaded !== pic_num) return;
//       clearInterval(timer);
//       var ctx = canvas.getContext('2d');

//       var bgColor = ctx.createLinearGradient(0, 0, canvas.width, 0);
//       bgColor.addColorStop(0, '#e1e1e1');
//       bgColor.addColorStop(0.1, '#e1e1e1');
//       bgColor.addColorStop(0.9, '#fff');
//       bgColor.addColorStop(1, '#fff');
//       ctx.fillStyle = bgColor;
//       ctx.fillRect(0,0,canvas.width,canvas.height);

//       for(var i = 1; i <= pic_num; i++){
//         var cord = {
//           x: getRandom(0, canvas.width - 10),
//           y: getRandom(0, canvas.height - 10)
//         };
//         ctx.drawImage(imgs[i - 1], cord.x, cord.y);
//       }

//       var url = canvas.toDataURL();
//       document.body.style.backgroundImage = url;

//     },200);
//     for(var i = 1; i <= pic_num; i++){
//       var img = new Image();
//       img.onload = function(){
//         imgs.push(img);
//         loaded++;
//       };
//       img.src = baseUrl + i + ".png";
//       console.log(img.src);
//     }

//     function getRandom(from, to){
//       var len = to - from;
//       return parseInt(Math.random() * len + from);
//     }
