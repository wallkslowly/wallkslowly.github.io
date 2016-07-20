$(document).ready(function(){
    var container = document.getElementsByClassName('container')[0];
    var height = container.offsetHeight;
    //20是减去滚动条的高度
    var docHeight = window.innerHeight;
    var offsetTop = (docHeight-height)/2;
    var phone = document.getElementsByClassName('phone')[0];
    var content = document.getElementsByClassName('content')[0];
    var width = phone.offsetWidth + content.offsetWidth;
    var docWidth = window.innerWidth;
    var offsetLeft = (docWidth-width)/2;

    container.style.top = offsetTop + 'px';
    container.style.left = offsetLeft + 'px';
	
    var imagebox=$(".showbox").children(".imagebox")[0],
    imageboxCopy=$(".showbox").children(".imageboxCopy")[0],
	imagenum=$(imagebox).children().size(),
	imageboxWidth=$(imagebox).width(),
	imagewidth=imageboxWidth*imagenum,
    icobox=$(".showbox").children(".icobox")[0],
    ico=$(icobox).children("span"),
	activeID=parseInt($($(icobox).children(".active")[0]).attr("rel")),
	nextID=0,intervalID,delaytime=2000,speed=700,
    beginTop = -386,
    beginLeft = imagewidth,
    carousel = "image";
	$(imagebox).css({"width":imagewidth+"px"});
    $(imageboxCopy).css({
        "width": imagewidth + "px",
        "top": beginTop + "px",
        "left": beginLeft + "px"
    });
    //nextId是即将动的id,0~4
	var rotate=function(clickID){
        if(clickID+1){
            nextID=clickID;
        }else{
            nextID=(activeID+1)%(2*imagenum);
        }
        if($(imagebox).css("left").substring(0, $(imagebox).css("left").length-2) <= -imagewidth){
            $(imagebox).css({"left":beginLeft+"px"});
            carousel = "imageCopy";
            nextID = 1;
        }
       if($(imageboxCopy).css("left").substring(0, $(imageboxCopy).css("left").length-2) <= -imagewidth){
             $(imageboxCopy).css({"left":beginLeft+"px"});
              carousel = "image";
              nextID = 1;
        }
        $(ico[activeID]).removeClass("active");
        if(nextID === imagenum){
            $(ico[0]).addClass("active");
        }else{
            $(ico[nextID]).addClass("active");
        }
        if(carousel === "image"){
            $(imagebox).animate({left:"-"+nextID*imageboxWidth+"px"},speed);
            $(imageboxCopy).animate({left: imagewidth-nextID*imageboxWidth+"px"},speed);
         }else if(carousel === "imageCopy"){
            $(imageboxCopy).animate({left:"-"+nextID*imageboxWidth+"px"},speed);
            $(imagebox).animate({left: imagewidth-nextID*imageboxWidth+"px"},speed);
         }
         //4和8完了后会闪一下
        if(nextID == 5){
            activeID = 0;
        }else{
            activeID=nextID;
        }
    };
	intervalID=setInterval(rotate,delaytime);
	$(imagebox).mouseover(function(){clearInterval(intervalID)});
	$(imagebox).mouseout(function(){intervalID=setInterval(rotate,delaytime)});
	$.each(ico,function(index,val){
		$(this).click(function(event){
			clearInterval(intervalID);
			var clickID=index;
			rotate(clickID);
			intervalID=setInterval(rotate,delaytime);
		})
	})
});