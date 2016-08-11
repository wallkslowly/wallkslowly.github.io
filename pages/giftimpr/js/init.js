var ismobile = (function(){
	if(window.innerWidth <= 450){
		return true;
	}
})()
var init = {
	//一个遮罩，需要的图片加载完就不显示了
	waitDisplay: function(){
		var $wait = $('#wait');
		$wait.height($(window).height());
		$wait.width($(window).width());
		var $dots =  $('.waitcontent div');
		var $dots0 = $dots.eq(0);
		var $dots1 = $dots.eq(1);
		var $dots2 = $dots.eq(2);
		$dots0.css({'backgroundColor': 'rgb(204, 204, 204)'});
		$dots1.css({'backgroundColor': 'rgb(204, 204, 204)'});
		$dots2.css({'backgroundColor': 'rgb(204, 204, 204)'});
		var num = 0;
		setInterval(function(){
			$dots.css({'backgroundColor': 'rgb(204, 204, 204)'});
			$dots.eq(num).css({'backgroundColor': 'rgb(153, 153, 153)'});
			num = (num+1)%3;
		}, 1000)
	},
	stopDisplay: function(){
		$('#wait').remove();
	},
	imageInit: function(){
		//为了预加载
		$(".girl").css({
			"background": "url('images/girl.png') no-repeat",
			"background-size": "cover"
		});
		$("#flower div").css({
			"background": "url('images/flower/duorou.png') center",
			"background-size": "cover"
		})
		$("#bird").css({
			"background": "url('images/bird.png') 0px 0px no-repeat",
			"background-size": "cover"
		})
	}
} 
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
			"left": this.left,
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
		if(ismobile){
			var Beginleft = Math.floor(Math.random()*maxWidth);
			var EndLeft = Math.floor(Math.random()*maxWidth);
		}else{
			var offsetLeft = maxWidth/4;
			var Beginleft = offsetLeft + Math.floor(Math.random()*offsetLeft*2);
			var EndLeft = offsetLeft + Math.floor(Math.random()*offsetLeft*2);
		}
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
	createFlower: function(){	
		this.dtd = $.Deferred(); 
		var girl = $(".girl");
		var topbackground = $(".bgtop");
		var $flowerPic1 = $(".left");
		var $flowerPic2 = $(".right");
		if(ismobile){
			/*$flowerPic1.css({		
				"left": parseInt(girl.css("left")) - parseInt($flowerPic1.width()),
				"top": topbackground.height()
			});	
			$flowerPic2.css({		
				"left": parseInt(girl.css("left")) + girl.width(),
				"top": topbackground.height()
			});*/
			$flowerPic1.css({		
				"left": 10,
				"top": topbackground.height()
			});	
			$flowerPic2.css({		
				"right": 10,
				"top": topbackground.height()
			});
			$flowerPic1.transition({
				opacity: 0.7
			}, 2500, "ease-out", function(){});	
			$flowerPic2.transition({
				opacity: 0.7
			}, 2500, "ease-out", function(){
				setTimeout(function(){
					flowerUtil.dtd.resolve();
				}, 2500);
			});
		}else{
			var startLeft1 = topbackground.width()/4;
			var startLeft2 = topbackground.width()/4*3;
			var endLeft1 = parseInt(girl.css("left"));
			var endLeft2 = parseInt(girl.css("left")) + girl.width();
			var endTop = topbackground.height();

			$flowerPic1.css({		
				"left": startLeft1,
			});	
			$flowerPic1.transition({
				left: endLeft1-100,
				top: endTop-100,
				opacity: 0.7
			}, 5000, "ease-out", function(){});
			//右侧
			$flowerPic2.css({	
				"left": startLeft2,
			});	
			$flowerPic2.transition({
				left: endLeft2,
				top: endTop-100,
				opacity: 0.7
			}, 5000, "ease-out", function(){
				flowerUtil.dtd.resolve();
			});
		}
		return this.dtd.promise();
	}
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
		this.initLeft = (document.documentElement.clientWidth-$text.width())/2;
		this.initTop = blankHeight/2;
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
			$("#ready").remove();
			$("#container").slideDown(5000, function(){
				readyUtil.dtd.resolve();
			});
		}
		var that = this;
			$("#ready").addClass("readyframe");
		setTimeout(task, 2000);
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
//鸟的控制
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
		$bird = $("#bird");
		var initLeft = parseInt(girlUtil.left) + $(".girl").width();
		var endLeft = parseInt(girlUtil.left) - $("#bird").width()/3;
		console.log( $("#bird").width())
		console.log( $(".girl").width())
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
		init.waitDisplay();
		var bgimg = new Image();
		bgimg.src = "images/background/c_background_top.png";
		bgimg.onload=bgimg.onerror =  function(){
			init.stopDisplay();
			$.when(readyUtil.playReady()).done(function(){
			girlUtil.setPos();
			textUtil.getPos();
			//预加载飘花的图片，防止网络不好时第一波飘的花在下落一半时才加载
			init.imageInit();
			//$snow = $("#snowflake");
			//$snow.css({"display": "none"});
			/*for(i=0, len=snowflakeUtil.snowArr.length; i<len; i++){	
				console.log(snowflakeUtil.snowArr[i]);
				var oDiv = document.createElement("div");
				$snow.append(oDiv);
				$("#snowflake div:last-child").css({
					"backgroundImage": "url(" + snowflakeUtil.snowArr[i] + ")",
					"display": "none"
				})
			}*/
			//两种方法，这样可以不操作dom
			var imgarr = new Array(snowflakeUtil.snowArr.length);
			snowflakeUtil.snowArr.forEach(function(item, index, array){
				var img = new Image();
				img.src = snowflakeUtil.snowArr[index];
				imgarr.push(img);
			})
			//这里如果用$snow.empty()会清除生成的div，但是会将加载的图片从缓存中删除
			//$snow.css({
			//	"display": "block"
			//});
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
		}
	},
}

animate.animationPlay();
