/**
 * This a widget chils class based on a template
 */
'use strict';
<% var currentName="widget-template"; %>
<%- include('../snippet/js-head.ejs', {fileName: currentName+'.js'}); -%>

var $ = require('jquery');
var Q = require('q');

var log = require('../lib/log');
var Error = require('../lib/Error');

var Display = require('../lib/display');

var Widget = require('../lib/widget');


var SINGLETON=function(id,selector,template,_getData){

	var that=new Widget(selector,function(element){
		// render the template into the element;
		var data=_getData();

		Display.renderIntoElement(element,id,data);
	});

//	that.id=id;
//	that.selector=selector;
//	that.template=template;
	
	that.init=function(){
		// compile le tamplate and associate to the id;
		return Display.compile(id,template);		
	};
	
	return that;
};

module.exports=SINGLETON;
