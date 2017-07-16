##HTML部分编码
- 标签严格闭合
- 代码按块注释，注释在代码块之前，说明该部分功能即可
- 多层$<div>$内容太长时在$</div>$后面进行对应注释，具体如下
- 除了装饰性图片，都要有合适的$alt$，利于SEO
- 每个页面$<head></head>$后面带有一下内容，指向error.html.该部分是在低版本ie中显示的错误页

```
<!--[if lte IE 8]>
<script type="text/javascript">
	location.href="error.html";
</script>
<[end if]-->
```

- 重要的、个性的标签用h1~h6标签，利用SEO

```
<div id="demo">
	<div id="inner">
		<div id="subinner">
			<!--massive code-->
			<!--massive code-->
			<!--massive code-->
			<!--massive code-->
			<!--massive code-->
			<!--massive code-->
		<div><!--subinner-->
	</div><!--inner-->
</div><!--demo-->
```

##css部分编码
> common.css中是一些基本的设置，每个网页都link进去，内容不多可以自己看一下，如有不同可覆盖但不要修改common.css。需要强调的是里面定义了$.big$, $.mid$, $.small$三种宽度的网页样式，以适应不同尺寸显示器, 默认为每个大模块添加.big类，以保证其居中。

> normalize.css是为了不同浏览器兼容使用的，也在每个网页link进去。他对样式的修改比较多，使用的时候多参考实际样式就好了。

> 其他子网页copy主页头部(header #title 和 nav)以及footer底部，并引入header.css 和 footer.css, 简单样式调整可以在html的$<style>$中覆盖
 
##js部分编码
 - 全部js基于jQuery开发
 - 注释标明每个代码块的功能即可
 - 头部nav有一个header.js，如果需要应引入。

##其他部分
 - 图片命名以其在网页中模块命名，对于全网站通用的图片可以直接根据图片信息命名编号
 - 对于背景图片用 **bg_** 开头，其他因情况自行决定，我一下也想不全
 - 对于图片特别多的单独页面，可以在img中在建一个文件夹存放
 - 外部库文件放在lib文件夹中
 - 对于代码中未完成的部分用TODO注释+描述标注出来，对于没有解决的bug也同样注释出来。举例如下：
 
 ```
 <!--TODO: 工作描述 -->
 /*BUG: bug描述 */
 //BUG: bug描述
```

<small>*以上仅是对该项目的一些约定，可根据需要自行修改</small>

##补充部分

- 字体名字“GJJXKai” 是全局的，不要重复使用
- 关于html文件命名我截了一个图，在主目录中
- 关于文章页的排版我放了一个`模板.html`在主目录中









