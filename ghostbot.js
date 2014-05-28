/**
 * GhostBot: A Simple Common Search Engine based On RSS
 * author: ZeroLing
 * Git: https://github.com/wssgcg1213/ghostbot
 * http://www.zeroling.com/
 */

/**
 * [Ajax Construct Function]
 * Usage: var ajax = new Ajax();
 *        ajax.post("ajax.php", "user=user&pwd=pwd", function (res) {
 *            document.write(res);
 *        })
 */
function Ajax() {
    "use strict";
    var aja = {};
    aja.tarUrl = '';
    aja.postString = '';
    aja.createAjax = function () {
        var xmlhttp;
        if (window.XMLHttpRequest) {                      
            xmlhttp = new XMLHttpRequest();
        } else {                                           
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        return xmlhttp;
    }

    aja.xhr = aja.createAjax();
    aja.processHandler = function () {
        if(aja.xhr.readyState == 4) {
            if(aja.xhr.status == 200) {
                aja.resultHandler(aja.xhr.responseText);
            }
        }
    }

    aja.get = function (tarUrl, callbackHandler) {
        aja.tarUrl = tarUrl;
        aja.resultHandler = callbackHandler;
        aja.xhr.onreadystatechange = aja.processHandler;
        aja.xhr.open('get', aja.tarUrl, true);
        aja.xhr.send();

    }

    aja.post = function (tarUrl, postString, callbackHandler) {
        aja.tarUrl = tarUrl;
        aja.postString = postString;
        aja.resultHandler = callbackHandler;
        aja.xhr.onreadystatechange = aja.processHandler;
        aja.xhr.open('post', aja.tarUrl, true);
        aja.xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        aja.xhr.send(aja.postString);
    }
    return aja;
}

var GhostBot = function (options) {
	this.defaults = {
		result_template: "<a href='{{link}}' class='searchResult'>{{title}}</a>",
		info_template: "<h4>Find{{amount}}Articles.</h4>",
		rss: "/rss",
	}
	var opts = this.extend({}, this.defaults, options);
	if(opts.inputbox)this.init(opts);
}
GhostBot.prototype.extend = function () {
    var _arg = Array.prototype.slice.call(arguments);
    for(var i = _arg.length - 1; i > 0 ; i--){
        var former = _arg[i - 1], latter = _arg[i];
        for(j in latter) former[j] = latter[j];
    }
    return _arg[0];
}

GhostBot.prototype.init = function (opts) {
	var that = this;
	this.result_template = opts.result_template;
	this.info_template = opts.info_template;
	this.target = opts.target;
	this.rss = opts.rss;
	this.inputbox = opts.inputbox;
	this.blogData = [];
	this.ajax = new Ajax();
	this.loadRss();
}

GhostBot.prototype.loadRss = function () {
	if(this.inited) return false;
	var index = this.index,
		rssUrl = this.rss,
		blogData = this.blogData,
		that = this;
	this.ajax.get(rssUrl, function (data) {
		that.parseXML(data, function (xmlDoc) {
			var items = xmlDoc.getElementsByTagName('item');
			items = Array.prototype.slice.call(items);
			items = items.map(function (i) {
				if(typeof i == 'function')return;
				return i;
			});
			that.items = items;
			that.inited = true;
			that.listen();
		});
	})
}

GhostBot.prototype.parseXML = function(xmlString, callback){
	var xmlDoc=null;    //支持IE浏览器 
	if(!window.DOMParser && window.ActiveXObject){  
	    var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
	    for(var i=0;i<xmlDomVersions.length;i++){
	        try{
	            xmlDoc = new ActiveXObject(xmlDomVersions[i]);
	            xmlDoc.async = false;
	            xmlDoc.loadXML(xmlString);
	            break;
	        }catch(e){
	        }
	    }
	}else if(window.DOMParser && document.implementation && document.implementation.createDocument){
	    try{
	        domParser = new  DOMParser();
	        xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
	    }catch(e){
	    }
	}
	else{
	    return null;
	}
	callback && callback(xmlDoc);
 	return xmlDoc;
}

GhostBot.prototype.listen = function (){
	var that = this;
	this.inputbox.onkeyup = function () {
		var ele = that.inputbox;
		if(!ele.value) return that.target.innerHTML = '';
		var _r = that.search(ele.value); //[{}, {}]
		var info_parsed = that.format(that.info_template, {
				amount: _r.length
			});
		var _HTML = info_parsed;
		for(i in _r) _HTML += that.format(that.result_template, _r[i]);
		that.target.innerHTML = _HTML;
	}
}

GhostBot.prototype.format = function(text, obj) {
	return text.replace(/{{([^{}]*)}}/g, function(a, b) {
		var r = obj[b];
		return typeof r === "string" || typeof r === "number" ? r : a
	})
}

GhostBot.prototype.search = function (kw) {
	var that = this;
	var _result = [];
	var _reg = new RegExp(kw.toLowerCase());
	this.items.forEach(function (i){
		var content = i.getElementsByTagName('description')[0].firstChild.data.replace(/<!((\[)?\[)|(\]\]>)/g, '').replace(/<[^>]*>/g ,'');
		var title = i.getElementsByTagName('title')[0].firstChild.data.replace(/<!((\[)?CDATA\[)|(\]\]>)/g, '');
		if(_reg.test(title.toLowerCase() + content.toLowerCase())){
			var link = i.getElementsByTagName('link')[0].firstChild.data;
			 	_result.push({
					keyword: kw,
					title: title,
					link: link,
					content: content
				});
		}
	});
	return _result;
}
