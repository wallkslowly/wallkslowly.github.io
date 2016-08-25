//调用$()，其实是返回以init函数为构造器的对象，定义在jQuery上的函数不能通过this访问，必须通过jQuery访问
(function(){
	var window = this;
	window.$ = window.easyQ = $ = easyQ = function(selector, context){
		return new easyQ.fn.init(selector, context);
	}
	easyQ.fn = easyQ.prototype = {
		constructor: easyQ,
		init: function(selector, context){
			var selector = selector || document;
			var context = context || document;
			if(selector.nodeType){
				this[0] = selector;
				this.length = 1;
				this.context = selector;
			}else if(typeof selector === 'string'){
				var eles = document.querySelectorAll(selector);
				if(eles){
					var len = eles.length;
					for(var i=0; i<len; i++){
						this[i] = eles[i];
					}
					this.context = context;
					this.length = len;
				}else{
					this.length = 0;
					this.context = context;
				}
			}else{
				if(Array.isArray(selector)){
					this.setArray(selector);
				}else{
					this.setArray(easyQ.makeArray(selector));
				}
			} 
			return this;
		},
		easyQ: '1.3.2',
		size: function(){
			return this.length;
		},
		clean: function(content){
			return document.createElement(content);
		},
		setArray: function(elems){
			Array.prototype.push.apply(this, elems);
		},
		html: function(val){
			if(!val){
				return this[0].innerHTML;
			}else{
				easyQ.each(this, function(val){
					this.innerHTML = val;
				}, val)
			}
		},
		pushStack: function(elems, name, selector){
			var ret = easyQ(elems);
			ret.prevObj = this;
			ret.context = this.context;
			return ret;
		},
		end: function(){
			return this.prevObj || easyQ();
		},
		eq: function(index){
			var obj = $(this[index]);
			obj.prevObj = this;
			return obj;
		},
		get: function(index){
			return index===null?
				Array.prototype.slice.call(this): this[index];	
		},
		slice: function(start, end){
			start = start || 0;
			end = end || this.length;
			var newObj = $(); 
			if(end > this.length){
				end = this.length;
			}
			newObj.length = end - start;
			newObj.prevObj = this;
			newObj.context = this.context;
			for(var i=start; i<end; i++){
				newObj[i-start] = this[i];
			}
			return newObj;
		},
		merge: function(second){
			//判断是否为easyQ对象
			if(second && second.end){
				var firLen = this.length;
				var secLen = second.length;
				var length = firLen + secLen;
				var newObj = $();
				newObj.length = length;
				newObj.prevObj = this;
				newObj.context = this.context;
				newObj.selector = this.selector; 
				for(var i=0; i<firLen; i++){
					newObj[i] = this[i];
				}
				for(var j=0; j<secLen; j++){
					newObj[firLen+j] = second[j];
				}
				return newObj;
			}else{
				this.prevObj = this;
				return this;
			}
		},
		add: function(easyElem){
			if(easyElem.end){
				this.merge(easyElem);
			}
			return this;
		},
		//模拟数组的方法,设计这些方法时，不允许链式调用了
		each: function(callback, args){
			easyQ.each(this, callback, args);
		},
		map: function(callback, args){
			return easyQ.map(this, callback, args)
		},
		filter: function(callback, args){
			var elems = easyQ.filter(this, callback, args);
			return $(elems);
		},
		//DOM方法
		//调用DOM方法后，不影响当前this中的DOM元素，调用this.merge()是为了保持链式调用
		append: function(param){
			if(typeof param === 'string'){
				//这里先改变父元素的innerHTML会造成子元素的innerHTML无法更新
				/*this.each(function(){
					this.innerHTML += param;
					console.log(this)
				})*/
				var len = this.length;
				for(var i=len-1; i>=0; i--){
					this[i].innerHTML += param;
				}
			}
			if(param.nodeType === 1){
				this.each(function(){
					var copy = param.cloneNode(true);
					this.appendChild(copy);
				})	
			}
			if(param.end){
				this.each(function(){
					//这里的this是要添加元素的DOM节点
					var len = param.length;
					for(var i=0; i<len; i++){
						var copy = param[i].cloneNode(true);
						this.appendChild(copy);
					}
				})
			}
			return this.merge();
		},
		insert: function(funcName, param){
			if(param.nodeType === 1){
				this.each(function(){
					var copy = param.cloneNode(true);
					this.parentNode[funcName](copy, this);
				})	
			}
			if(param.end){
				this.each(function(){
					var len = param.length;
					for(var i=0; i<len; i++){
						var copy = param[i].cloneNode(true);
						this.parentNode[funcName](copy, this);
					}
				})
			}
		},
		before: function(param){
			this.insert('insertBefore', param);
		},
		after: function(param){
			if(param.nodeType === 1){
				this.each(function(){
					var copy = param.cloneNode(true);
					var tempNode = this.nextElementSibling;
					if(tempNode)
						this.parentNode.insertBefore(copy, tempNode);
					else
						this.parentNode.appendChild(copy);
				})	
			}
			if(param.end){
				this.each(function(){
					var len = param.length;
					for(var i=0; i<len; i++){
						var copy = param[i].cloneNode(true);
						var tempNode = this.nextElementSibling;
						if(tempNode)
							this.parentNode.insertBefore(copy, tempNode);
						else
							this.parentNode.appendChild(copy);
					}
				})
			}
		},
		remove: function(){
			this.each(function(){
				var parent = this.parentNode;
				if(parent && (parent.nodeType===1||parent.nodeType===9)){
					this.parentNode.removeChild(this);
				}
			})
			return this.merge();
		},
		empty: function(){
			this.each(function(){
				this.innerHTML = '';
			})
			return this.merge();
		},
		replaceWidth: function(param){
			if(param.nodeType){
				this.each(function(){
					var copy = param.cloneNode(true);
					this.parentNode.replaceChild(copy, this);
				})
			}
			this.merge();
		},
		test: function(){
			console.log("asd");
			console.log(this);
		}
	}
	easyQ.fn.init.prototype = easyQ.fn;
	//如果参数是数组，则全部传入，如果不是，只传入第一个
	easyQ.each = function(object, callback, args){
		if(Array.isArray(args)){
			for(var i=0; i<object.length; i++){
				callback.apply(object[i], args);
			}
		}else{
			for(var i=0; i<object.length; i++){
				callback.call(object[i], args);
			}
		}
	};
	//返回运行的结果
	easyQ.map = function(object, callback, args){
		var ret = [];
		if(Array.isArray(args)){
			for(var i=0; i<object.length; i++){
				ret.push(callback.apply(object[i], args));
			}
		}else{
			for(var i=0; i<object.length; i++){
				ret.push(callback.call(object[i], args));
			}
		}
		return ret;
	}
	//返回满足函数的项，暂时只考虑函数
	easyQ.filter = function(object, callback, args){
		var ret = [];
		if(Array.isArray(args)){
			for(var i=0; i<object.length; i++){
				if(callback.apply(object[i], args)){
					ret.push(object[i])
				}
			}
		}else{
			for(var i=0; i<object.length; i++){
				if(callback.call(object[i], args)){
					ret.push(object[i]);
				};
			}
		}
		return ret;
	}
	easyQ.makeArray = function(elems){
		var ret = [];
		var length = elems.length;
		if(length){
			for(var i=0; i<length; i++){
				ret.push(elems[i]);
			}
		}
		return ret;
	}
	easyQ.extend = easyQ.fn.extend = function(obj){
		if(typeof obj === 'object'){
			for(var prop in obj){
				this[prop] = obj[prop];
			}
		}
	}
})()