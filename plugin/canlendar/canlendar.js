window.onload = function(){
	var parent = document.getElementById('wrapper');
	var fun = Canlender(parent, [], function(){parent.style.display='none'});
	fun();
}
//Canlendar接受三个参数，父元素，配置和回调函数，配置为日期显示的起始终止年份，选中日期的颜色
//当选中一个日期后，会执行回调函数，并传入年份，月份，日期，三个，和html中的日历元素
var Canlender = function(parent, optionArr, callback){
	var parent = parent || document.body;
	var	maxYear = optionArr[0] || 2030;
	var	minYear = optionArr[1] || 1970;
	var	color = optionArr[2] || '#F90';
	var monthInfo = {1:31, 3:31, 4:30, 5:31, 6:30, 7:31, 8:31, 9:30, 10:31, 11:30, 12: 31};
	var markTd = null;
	var DATE = new Date();
	var yearSpan = null;
	var monthSpan = null;
	var createDom = function(){
		var html = '';
		html += '<div id="title">';
		html +=	'<div class="left-bar"><div class="double-left"></div><div class="single-left"></div></div>'
		html += '<div class="middle"><span id="year"></span>年<span id="month"></span>月</div>';
		html += '<div class="right-bar">';
		html += '<div class="single-right"></div><div class="double-right"></div></div>';
		html += '</div><div id="content">';
		html += '<table id="tableCanlendar" cellspacing="0"><thead>';
		html += '<tr><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td></tr></thead>';
		html += '<tbody id="canlendar">';
		for(var i=0; i<5; i++){
			html += '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
		}
		html += '</tbody></table>';
		html += '</div>';
		parent.innerHTML = html;
	}
	var init = function(){
		yearSpan = document.getElementById('year');
		monthSpan = document.getElementById('month');
		var year = DATE.getFullYear();
		var month = DATE.getMonth() + 1;
		yearSpan.innerHTML = year;
		monthSpan.innerHTML = month;
		
		var date = DATE.getDate();
		var day = DATE.getDay();
		var y = parseInt(date/7);
		var x = day;
		var canlendar = document.getElementById('canlendar');
		var trEle = canlendar.getElementsByTagName("tr")[y];
		var tdEle = trEle.getElementsByTagName("td")[x];
		tdEle.innerHTML = date;
		markTd = tdEle;
		drawCanlendar(year, month, markTd);
		var dl = document.getElementsByClassName('double-left')[0];
		var sl = document.getElementsByClassName('single-left')[0];
		var dr = document.getElementsByClassName('double-right')[0];
		var sr = document.getElementsByClassName('single-right')[0];
		EventUtil.addEvent(dl, 'click', changeYearAndMonth);
		EventUtil.addEvent(sl, 'click', changeYearAndMonth); 
		EventUtil.addEvent(dr, 'click', changeYearAndMonth);
		EventUtil.addEvent(sr, 'click', changeYearAndMonth);
		
		EventUtil.addEvent(canlendar, 'click', chooseDate);
	}
	var changeYearAndMonth = function(e){
		var e = EventUtil.getEvent(e);
		var target = EventUtil.getTarget(e);
		var className = target.className;
		var content = -1;
		switch(className){
			case 'double-left':
				content = Number(yearSpan.innerHTML);
				if(--content>=minYear){
					yearSpan.innerHTML = content;
				}
				break;
			case 'single-left': 
				content = Number(monthSpan.innerHTML);
				if(--content>=1){
					monthSpan.innerHTML = content;
				}else{
					monthSpan.innerHTML = 12;
				}
				break;
			case 'double-right': 
				content = Number(yearSpan.innerHTML);
				if(++content<=maxYear){ 
					yearSpan.innerHTML = content;
				}
				break;
			case 'single-right': 
				content = Number(monthSpan.innerHTML);
				monthSpan.innerHTML = content%12 + 1;
				break;
			
		}
		drawCanlendar(Number(yearSpan.innerHTML), Number(monthSpan.innerHTML));
	}
	var drawCanlendar = function(year, month, mark){
		var date = 1;
		var totalDay = 0;
		if(month !== 2){
			totalDay = monthInfo[month];
		}else{
			if(year%4 !== 0){
				totalDay = 29;
			}else{
				totalDay = 28;
			}
		}
		var allTd = document.querySelectorAll('tbody td');
		var len = allTd.length;
		var firstWeekDay = getWeekDay(year, month, date);
		
		for(var i=0; i<len; i++){
			if(i>=firstWeekDay && i<totalDay+firstWeekDay){
				allTd[i].innerHTML = i-firstWeekDay+1;
				if(allTd[i].className.indexOf(' mark') === -1){
					allTd[i].className += ' mark';
				}
			}else{
				allTd[i].innerHTML = '';
				if(allTd[i].className){
					allTd[i].className = allTd[i].className.replace(' mark', '');
				}
			}
		}
		if(!mark){
			allTd[firstWeekDay].style.backgroundColor = color;
			markTd.style.backgroundColor = '';
			markTd = allTd[firstWeekDay];
		}else{
			mark.style.backgroundColor = color;
		}
	}
	var chooseDate = function(e){
		var e = EventUtil.getEvent(e);
		var target =  EventUtil.getTarget(e);
		if(target.nodeName.toLowerCase()==='td' && target.className.indexOf(' mark')!==-1){
			var year = Number(yearSpan.innerHTML);
			var month = Number(monthSpan.innerHTML);
			var date = Number(target.innerHTML);
			markTd.style.backgroundColor = '';
			target.style.backgroundColor = color;
			markTd = target;
			callback.call(null, year, month, date, parent);
		}
	}
	var getWeekDay = function(year, month, date){
		if(month == 1){
			month = 13;
			year--;
		}
		if(month == 2){
			month = 14;
			year--;
		}
		var c = parseInt(year.toString().slice(0,2));
		year = parseInt(year.toString().slice(2,4));
		var xtd = parseInt(c/4)-2*c+year+parseInt(year/4)+parseInt(26*(month+1)/10)+date-1;
		while(xtd < 0){
			xtd = xtd + 7;
		}
		xtd = xtd%7;
		return xtd;
	}
	var EventUtil = {
		addEvent: function(element, type, handler){
			if(window.addEventListener){
				element.addEventListener(type, handler, false);
			}else if(window.attachEvent){
				element.attachEvent('on'+type, handler);
			}else{
				element['on'+type] = hadler;
			}
		},
		removeEvent: function(element, type, handler){
			if(window.removeEventListener){
				element.removeEventListener(type, handler, false);
			}else if(window.detachEvent){
				element.detachEvent('on'+type, handler);
			}else{
				element['on'+type] = null;
			}
		},
		getEvent: function(e){
			return e || window.event;
		},
		getTarget: function(e){
			return e.target || e.srcElement;
		},
		stopPropagation: function(e){
			if(e.stopPropagation){
				e.stopPropagation();
			}else{
				e.cancelBubble = true;
			}
		},
		preventDefault: function(e){
			if(e.preventDefault){
				e.preventDefault();
			}else{
				return false;
			}
		}
		
	}
	var getCanlender = function(){
		createDom();
		init();
	}
	return getCanlender;
}