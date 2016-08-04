var Router = function(){
	//{'path': function}
	this.routers = {}
}
Router.prototype = {
	constructor: Router,
	//为每个hash绑定处理函数
	bindFunc: function(path, fn){
		var pattern = /^\//;
		//放置不规范的hash值
		if(typeof path==='string' && pattern.test(path)){
			fn = fn || function(){};
			this.routers[path] = fn;
		}else{
			throw new Error("需要/开头");
		}
	},
	//获取当前hash值并执行响应的处理函数
	doHashChange: function(){
		var path = location.hash.substring(1);
		this.routers[path].apply(this);
	},
	init: function(){
		window.addEventListener('load', this.bind(this.doHashChange, this), false);
		window.addEventListener('hashchange', this.bind(this.doHashChange, this), false);
	},
	//绑定作用域
	bind: function(fn, context){
		return function(){
			return fn.apply(context, arguments);
		}
	}
}
var myRouter = new Router();
myRouter.init();
	
