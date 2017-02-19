/*
 * Json reader
 */
'use strict';

var Q = require('q');

var core = require('ginere-core');
var log=core.log;
var $=core.$;
var gfs=core.gfs;
var Sort=core.sort;

var SINGLETON={};



function createEmptyArray(obj){
	return [];
}



var COMMON_TRANSFORMER={
	id:true

	,name:true
	,description:true
	,tags:true
	,date:true
		
	,year:true
	,rateHuman:"rate"
	,rate:getRate
	,rateCount:true
	,hit:true

	,country:true
	,director:true
	,screenwriter:true
	,music:true

	,cinematography:true
	,cast:true
	,production:true
	,originalTitle:true
	,runtime:true
};

var MOVIE_TRANSFORMER=$.extend({},COMMON_TRANSFORMER,{
	video:getVideo
	
	, languages:createLanguajes
	, subtitles:createSubtitles

	, size:"sizeHuman"
	, height:"height"
	, date:"date"

	, url: true
	, episode:true
	, videoResolution:true
	, season:true
});

var SEASON_TRANSFORMER=$.extend({},COMMON_TRANSFORMER,{
	season:"seasonNumber"
	, numberOfSeasons:true
	, a:true
	, b:true
//	, a: createEmptyArray
//	, b: createEmptyArray

});

function transformJson(transformer,obj1,obj2,obj3){
	var ret={};
	
	$.each(transformer,function(key,value){
		if ($.isFunction(value)){
			ret[key]=value(obj1,obj2,obj3);
		} else if ($.type(value) === 'string' ){
			ret[key]=obj1[value];
		} else {
			ret[key]=obj1[key];
		}
	});

	return ret;
}


SINGLETON.transformJsonMOVIE=function(obj1,obj2,obj3){
	return transformJson(MOVIE_TRANSFORMER,obj1,obj2,obj3);
};

SINGLETON.transformJsonSEASON=function(obj1,obj2,obj3){
	return transformJson(SEASON_TRANSFORMER,obj1,obj2,obj3);
};

module.exports=SINGLETON;
