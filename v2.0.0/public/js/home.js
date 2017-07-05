var canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1079;
    var imgs = [];
    var baseUrl = "img/bg_";
    var pic_num = 4;
    var loaded = 0;
    var sWidth = screen.availWidth;
    var sHeight = screen.availHeight;
    var timer = setInterval(function(){
      if(loaded !== pic_num) return;
      clearInterval(timer);
      var ctx = canvas.getContext('2d');

      var bgColor = ctx.createLinearGradient(0, 0, canvas.width, 0);
      bgColor.addColorStop(0, '#e1e1e1');
      bgColor.addColorStop(0.1, '#e1e1e1');
      bgColor.addColorStop(0.9, '#fff');
      bgColor.addColorStop(1, '#fff');
      ctx.fillStyle = bgColor;
      ctx.fillRect(0,0,canvas.width,canvas.height);

      for(var i = 1; i <= pic_num; i++){
        var cord = {
          x: getRandom(0, canvas.width - 10),
          y: getRandom(0, canvas.height - 10)
        };
        ctx.drawImage(imgs[i - 1], cord.x, cord.y);
      }

      var url = canvas.toDataURL();
      document.body.style.backgroundImage = url;

    },200);
    for(var i = 1; i <= pic_num; i++){
      var img = new Image();
      img.onload = function(){
        imgs.push(img);
        loaded++;
      };
      img.src = baseUrl + i + ".png";
      console.log(img.src);
    }

    function getRandom(from, to){
      var len = to - from;
      return parseInt(Math.random() * len + from);
    }
