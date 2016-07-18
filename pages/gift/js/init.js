//小女孩控制
var girlUtil = {
	dtd: null,
	top: "",
	left: "",
	setPos: function(){
		var topbackground = $(".bgtop");
		var girl = $(".girl");
		var offset = $("#container").height()*0.02;
		this.top = topbackground.height() - girl.height() - offset;
		this.left = (topbackground.width() - girl.width())/2;
		girl.css({
			"top": -girl.height(),
			"left": this.left
		});
	},
	setGirl: function(){
		this.dtd = $.Deferred();
		var girl = $(".girl");
		girl.transition({
			"top": this.top
		}, 5000, "linear", function(){
			girlUtil.dtd.resolve();
		});
		return girlUtil.dtd.promise();
	}
}
//飘花控制
var snowflakeUtil = {
	dtd: null,
	snowArr: [
				"images/snowflake/snowflake1.png",
				"images/snowflake/snowflake2.png",
				"images/snowflake/snowflake3.png",
				"images/snowflake/snowflake4.png",
				"images/snowflake/snowflake5.png",
				"images/snowflake/snowflake6.png",
			],
	snowInterval: "",
	createSnow: function(num, stoprotate){
		var index = Math.floor(Math.random()*6);
		index = num || index;
		var snow = document.createElement("div");
		var maxWidth = $("#container").width();
		//只在桥附近飘花
		var offsetLeft = maxWidth/4;
		var Beginleft = offsetLeft + Math.floor(Math.random()*offsetLeft*2);
		var EndLeft = offsetLeft + Math.floor(Math.random()*offsetLeft*2);
		var EndTop = $("#container").height();
		$div = $("#snowflake");
		$div.append(snow);
		$snow = $("#snowflake div:last-child");
		$snow.css({
			"height": 41,
			"width": 41,
			"opacity": 1,
			"zIndex": 200,
			"position": "absolute",
			"top": "-41px",
			"backgroundImage": "url(" + this.snowArr[index] + ")",		
			"left": Beginleft
		});	
		if(!stoprotate){
			$snow.addClass("snowRotate");	
		}	
		$snow.transition({
			left: EndLeft,
			top: EndTop-41,
			opacity: 0.5
		}, 5000, "ease-out", function(){
			this.fadeOut(1000);
			var that = this;
			setTimeout(function(){
				that.remove();
			}, 1000);
		});
	},
	beginSnow: function(){
		this.dtd = $.Deferred();
		var that = this;
		this.snowInterval = setInterval(function(){
			that.createSnow();
		}, 100);
	}, 
	stopSnow: function(timeout){
		var that = this;
		setTimeout(function(){
			clearInterval(that.snowInterval)
			setTimeout(function(){
				that.dtd = that.dtd.resolve();
			}, 6000)
		}, timeout);
		return this.dtd.promise();		
	}
}
//多肉花控制
var flowerUtil = {
	dtd: null,
	flowerArr: [
				"images/flower/duorou1.jpg",
				"images/flower/duorou2.jpg",
			],
	createFlower: function(){	
		this.dtd = $.Deferred(); 
		var flowerPic1 = document.createElement("div");
		var flowerPic2 = document.createElement("div");
		var topbackground = $(".bgtop");
		var girl = $(".girl");
		var startLeft1 = topbackground.width()/4;
		var startLeft2 = topbackground.width()/4*3;
		var endLeft1 = parseInt(girl.css("left"));
		var endLeft2 = parseInt(girl.css("left")) + girl.width();
		var endTop = topbackground.height();
		
		//只在桥附近飘花
		$div = $("#flower");
		$div.append(flowerPic1);
		$flowerPic1 = $("#flower div:last-child");
		$flowerPic1.css({
			"height": 100,
			"width": 100,
			"opacity": 0.3,
			"zIndex": 300,
			"position": "absolute",
			"top": "-100px",
			"backgroundImage": "url(images/flower/duorou.png)",
			"backgroundSize": "cover",
			"backgroundPosition": "center",		
			"left": startLeft1,
			"borderRadius": 50
		});	
		$flowerPic1.transition({
			left: endLeft1-100,
			top: endTop-100,
			opacity: 0.7
		}, 5000, "ease-out", function(){});
		//右侧
		$div.append(flowerPic2);
		$flowerPic2 = $("#flower div:last-child");
		$flowerPic2.css({
			"height": 100,
			"width": 100,
			"opacity": 0.5,
			"zIndex": 300,
			"position": "absolute",
			"top": "-100px",
			"backgroundImage": "url(images/flower/duorou.png)",
			"backgroundSize": "cover",
			"backgroundPosition": "center",		
			"left": startLeft2,
			"borderRadius": 50
		});	
		$flowerPic2.transition({
			left: endLeft2,
			top: endTop-100,
			opacity: 0.7
		}, 5000, "ease-out", function(){
			flowerUtil.dtd.resolve();
		});
		return this.dtd.promise();
	},
}
//文字控制
var textUtil = {
	dtd: null,
	hasdtd: false,
	textArr: [
				"1",
				"2",
				"3",
				"4",
				"5!",
				"6!",	
				"7",
				"8!",
				"9"		
			],
	index: 0,
	initLeft: "",
	initTop: "",
	getPos: function(){
		var $text = $("#text");
		var blankHeight = $(".bgtop").height()/5;
		this.initLeft = (document.documentElement.clientWidth-$text.width())/2;//str
		this.initTop = blankHeight/2;//str
	},
	//num表示文字浮现的次数
	playText: function(num){
		if(!this.hasdtd){
			this.hasdtd = true;
			this.dtd = $.Deferred();
		}
		var $text = $("#text");
		var height = $text.height();
		$text.css({
			"left": textUtil.initLeft,
			"top": textUtil.initTop,
			"opacity": 1
		});
		$text.text(this.textArr[this.index++]);
		$text.transition({
			top: parseInt(textUtil.initTop)-height/2,
			opacity: 0
		}, 2000, "ease-out", function(){});
		num--;
		var that = this;
		setTimeout(function(){
			if(num>0){
				textUtil.playText.call(that, num);
			}else{
				textUtil.hasdtd = false;
				textUtil.dtd = textUtil.dtd.resolve();
			}
		}, 2500);
		return textUtil.dtd.promise();
	}	
}
//开始和结束
var readyUtil = {
	dtd: null,
	playReady: function(){
		this.dtd = $.Deferred();
		var clientWidth = document.documentElement.clientWidth;
		var clientHeight = document.documentElement.clientHeight;
		var task = function(){
			$("#container").slideDown(5000, function(){
				readyUtil.dtd.resolve();
			});
		}
		var that = this;
		setTimeout(function(){
			$("#ready").addClass("readyframe");
		}, 1000)
		setTimeout(task, 3000);
		return this.dtd.promise();
	},
	playEnd: function(){
		$("#container").slideUp(5000,function(){
					var $end = $("#end");
		$end.fadeIn(4000);
		setTimeout(function(){
			$end.fadeOut(4000);
		},2000);
		})
	}
}
var birdUtil = {
	dtd: null,
	birdArr: [
				"鸟1",
				"鸟2",
				"鸟3"
			],
	index: 0,
	birdFly: function(num){
		if(this.dtd === null){
			this.dtd = $.Deferred();
		}
		var initLeft = parseInt(girlUtil.left) + $(".girl").width();
		var endLeft = parseInt(girlUtil.left);
		$bird = $("#bird");
		$bird.empty();
		var oDiv = document.createElement("div");
		var $div = $(oDiv);
		$div.css({
			"position": "relative",
			"left": "0",
			"top": "-10px",
			"whiteSpace": "nowrap",
			"text-align": "center",
			"font-size": "20px"
		});
		$bird.append($div);
		$div.text(this.birdArr[this.index++]);
		$bird.css({
			"left": initLeft + "px",
			"top": "20px",
			"display": "block",
			"opacity": 1
		});
		$bird.transition({
			left: endLeft,
			opacity: 0
		}, 2000, "linear", function(){});
		var that = this;
		num--;
		setTimeout(function(){
			if(num>0){
				birdUtil.birdFly.call(that, num);
			}else if(num===0){
				birdUtil.dtd = birdUtil.dtd.resolve();
			}
		}, 2500)
		return birdUtil.dtd.promise();
	},
}
//编排动画
var animate = {
	animationPlay: function(){
		$.when(readyUtil.playReady()).done(function(){
			girlUtil.setPos();
			textUtil.getPos();
			$.when(textUtil.playText(5)).done(function(){
				girlUtil.setGirl();
				setTimeout(function(){
					$.when(birdUtil.birdFly(3)).done(function(){
						$.when(textUtil.playText(1)).done(function(){
							setTimeout(function(){
								textUtil.playText(1);
							}, 2000);
							$.when(flowerUtil.createFlower()).done(function(){
								setTimeout(function(){
									$.when(textUtil.playText(2)).done(function(){
										snowflakeUtil.beginSnow();
										$.when(snowflakeUtil.stopSnow(10000)).done(function(){
											$.when().done(function(){
												readyUtil.playEnd();
											})
										})
									})
								}, 100)
							})
						})
					})
				}, 2000)
			})
		})
	},
}
animate.animationPlay();
