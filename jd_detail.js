window.$=HTMLElement.prototype.$=function(selector){
	var elems=(this==window?document:this).querySelectorAll(selector);
	return elems.length==0?null:
		   elems.length==1?elems[0]:
		   elems;			  
};
HTMLElement.prototype.bind=function(eName,fn,capture){
	this.addEventListener(eName,fn,capture);
}
HTMLElement.prototype.css=function(prop,value){
	if(value===undefined){
		return getComputedStyle(this)[prop];
	}else{
		this.style[prop]=value;
	}
}
/*******顶部导航菜单*******/
//找到#app_jd_items的div，设置显示
function show(e){
	this.$("[id$='_items']").style.display="block";
	//在当前li下找第一个a，设置其class为hover
	this.$("a")[0].className="hover";
}
//找到#app_jd_items的div，设置隐藏
function hide(e){
	this.$("[id$='_items']").style.display="none";
	//在当前li下找第一个a，清除class
	this.$("a")[0].className="";
}
//找到class为app_jd的li，绑定鼠标进入事件
$(".app_jd").bind("mouseover",show);
//找到class为app_jd的li，绑定鼠标移出事件
$(".app_jd").bind("mouseout",hide);
$(".service").bind("mouseover",show);
$(".service").bind("mouseout",hide);

/*******全部商品分类菜单*******/
//为#category的div绑定鼠标进入事件
$("#category").bind("mouseover",function(e){
	//找到#cate_box的的元素，设置显示
	this.$("#cate_box").style.display="block";
});
//为#category的div绑定鼠标移出事件
$("#category").bind("mouseout",function(e){
	//找到#cate_box的的元素，设置隐藏
	this.$("#cate_box").style.display="none";
});

//为找到#cate_box的的元素绑定鼠标进入
$("#cate_box").bind("mouseover",function(e){
	//如果target的id不是#cate_box
	var target=e.target;
	if(target.id!="cate_box"){
		//循环：target的父元素的id不是#cate_box
		while(target.parentNode.id!="cate_box"){
			//将target改为target的父元素
			target=target.parentNode;
		};
		//在target下找  .sub_cate_box  的div，设置显示,target下找h3,设置class为hover
		target.$(".sub_cate_box").style.display="block";
		target.$("h3").className="hover";
	}	
});		
//为找到#cate_box的的元素绑定鼠标移出
$("#cate_box").bind("mouseout",function(e){
	//如果target的id不是#cate_box
	var target=e.target;
	if(target.id!="cate_box"){
		//循环：target的父元素的id不是#cate_box
		while(target.parentNode.id!="cate_box"){
			//将target改为target的父元素
			target=target.parentNode;
		};
		//在target下找  .sub_cate_box  的div，设置隐藏,target下找h3,清除class为hover
		target.$(".sub_cate_box").style.display="none";
		target.$("h3").className="";
	}	
});

/*******商品详情标签页*******/
//为main_tabs绑定单击事件
product_detail.$("ul.main_tabs").bind("click",function(e){
	//获得target
	var target=e.target;
	if(target!=this){
		if(target.nodeName=="A"){
			target=target.parentNode;
		}
		this.$(".current").className="";
		target.className="current";
		var divs=$("#product_detail>[id^='product_']");
		for(var i=0;i<divs.length;i++){
			divs[i].style.display=(i!=target.dataset.i)?"none":"block";
		}
	}
});

/*******放大镜*******/
var zoom={
	//每个li的宽度
	LIWIDTH:0,
	//总的li个数
	COUNT:0,
	//左移的li个数
	moved:0,
	//ul的起始left值
	OFFSET:0,
	//mask大小
	MSIZE:0,
	//保存mask最大可用top
	MAXTOP:0,
	//保存mask最大可用left
	MAXLEFT:0,
	
	init:function(){
		//找到#icon_list下的第一个li，获取其计算后的样式中width，转为浮点数，保存在LIWIDTH中(62)
		this.LIWIDTH=parseFloat(getComputedStyle($("#icon_list>li:first-child")).width);
		//找到#icon_list下的所有li，获取其个数保存在COUNT中(8)
		this.COUNT=$("#icon_list>li").length;
		//获得#icon_list的元素计算后的left值，转为浮点数，保存在OFFSET中(20)
		this.OFFSET=parseFloat($("#icon_list").css("left"));
		//找到class以forward开头的a绑定单击事件
		$("a[class^='forward']").bind("click",this.move.bind(this));
		//找到class以backward开头的a绑定单击事件
		$("a[class^='backward']").bind("click",this.move.bind(this));
		//为id为icon_list的元素绑定鼠标进入时间为changeMImg
		$("#icon_list").bind("mouseover",this.changeMImg);
		//为#superMask绑定鼠标进入事件，为maskToggle
		$("#superMask").bind("mouseover",this.maskToggle);
		//为#superMask绑定鼠标移出事件，为maskToggle
		$("#superMask").bind("mouseout",this.maskToggle);
		//计算MSIZE：#mask的宽，转为浮点数
		this.MSIZE=parseFloat($("#mask").css("width"));
		//计算MAXTOP：#superMask的高-MSIZE，转换为浮点数
		this.MAXTOP=parseFloat($("#superMask").css("height"))-this.MSIZE;
		//计算MAXLEFT：#superMask的宽-MSIZE，转换为浮点数
		this.MAXLEFT=parseFloat($("#superMask").css("width"))-this.MSIZE;
		//为#superMask的元素绑定鼠标移动事件，为maskMove
		$("#superMask").bind("mousemove",this.maskMove.bind(this));
	},
	move:function(e){
		//获得目标元素target
		var target=e.target;
		//如果target的class中找不到disable
		if(!target.className.endsWith("disabled")){
			//修改moved，如果target的class以forward开头，+1，否则-1
			this.moved+=(target.className.startsWith("forward"))?1:-1;
			//设置id为icon_list的元素的left为-moved*LIWIDTH+20
			$("#icon_list").css("left",this.OFFSET-this.moved*this.LIWIDTH+"px");
			//检查a状态
			this.checkA();
		}
	},
	checkA:function(){
		//如果moved==0
		if(this.moved==0){
			//设置class为backward_disabled，即禁用
			$("a[class^='backward']").className="backward_disabled";
		}	
		//如果COUNT-moved==5
		else if(this.COUNT-this.moved==5){
			//设置class为forward_disabled，即禁用
			$("a[class^='forward']").className="forward_disabled";
		}
		//否则，backward的class设置成backward，forward的class设置成forward
		else{
			$("a[class^='backward']").className="backward";
			$("a[class^='forward']").className="forward";
		}
	},
	/******更换展示图片*******/
	changeMImg:function(e){
		//获得target
		var target=e.target;
		//如果target是img
		if(target.nodeName=="IMG"){
			//获得target的src中最后一个 . 的位置i
			var i=target.src.lastIndexOf(".");
			//设置id为mImg的元素的src属性为：target的target的src截取0~i，拼上-m，拼上target的src截取i~结尾
			$("#mImg").src=target.src.slice(0,i)+"-m"+target.src.slice(i);
		}
	},
	/*******切换mask显示*******/
	maskToggle:function(){
		//如果#mask元素是显示的，改为隐藏,否则改为显示
		$("#mask").style.display=$("#mask").css("display")=="block"?"none":"block";
		//设置#largeDiv的display为mask的display
		$("#largeDiv").css("display",$("#mask").css("display"));
		//获取mImg的src，查找最后一个m的位置i
		var i=$("#mImg").src.lastIndexOf("m");
		//设置largeDiv的背景图片
		var src=$("#mImg").src.slice(0,i)+"l"+$("#mImg").src.slice(i+1);
		$("#largeDiv").css("backgroundImage","url("+src+")");
		
		
	},
	/*******移动遮罩层********/
	maskMove:function(e){
		//获得鼠标相对于父元素的x,y
		var x=e.offsetX;
		var y=e.offsetY;
		//top：y-MSIZE/2
		var top=y-this.MSIZE/2;
		//left：x-MSIZE/2
		var left=x-this.MSIZE/2;
		//如果top<0,重置为0，如果大于MAXTOP，重置为MAXTOP，否则不变
		top=top<0?0:top>this.MAXTOP?this.MAXTOP:top;
		//如果left<0,重置为0，如果大于MAXLEFT，重置为MAXLEFT，否则不变
		left=left<0?0:left>this.MAXLEFT?this.MAXLEFT:left;
		//设置#mask的top值为top
		$("#mask").css("top",top+"px");
		//设置#mask的left值为left
		$("#mask").css("left",left+"px");
		//设置#largeDiv的backgroundPosition为-16/7*left+“px” -16/7*top+“px”
		$("#largeDiv").css("backgroundPosition",-16/7*left+"px "+(-16/7*top)+"px");
	},
}
zoom.init();
