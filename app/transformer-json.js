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


function getRate(object){
	if (object === undefined) {
		return 0;
	} else {
		//var rate=object["rate"];
		var rate=object.rate;

		if ( typeof rate === undefined || ! rate ) {
			return 0;
		} else if ( typeof rate === 'number' ) {
			return rate;
		} else {
			try {
				// log.error("Rate:"+parseInt(rate));
				rate=rate.replace(",", "");
				
				return parseInt(rate);
			}catch(err){
				log.error("While parsing number:"+rate,err);
				return 0;
			}
		}
	}
}

function getProfile(profile){
	try {
		if (!profile || !profile.servers){
			return [];
		} else {
			var servers=profile.servers;	
			var url=profile.videoUri;
			var height=profile.height;
			var ret=[];
			
			$.each(servers,function(key,value){
				ret.push({server:value.id,url:url,height:height});
			});
			
			return ret;
		}
	}catch(err){
		log.error("++++++++++++++++++++++++++++++++++++",err);
		log.error("++++++++++++++++++++++++++++++++++++",err);
		log.error("++++++++++++++++++++++++++++++++++++",err);
		log.error("++++++++++++++++++++++++++++++++++++",err);
		log.error("++++++++++++++++++++++++++++++++++++",err);
		log.error("++++++++++++++++++++++++++++++++++++",err);
		log.error("++++++++++++++++++++++++++++++++++++",err);
		log.error("++++++++++++++++++++++++++++++++++++",err);

		log.error(profile,err);
		process.exit(0);
	}
}

function getVideo(repo){
	try {
//		if (repo === undefined || !repo["profiles"]) {
		if (repo === undefined || !repo.profiles) {
			return null;
		} else {
			var profiles=repo.profiles;
			var ret={};
			
			// log.error(JSON.stringify(profiles));

			ret["0"]=getProfile(profiles.default);
			ret["240"]=getProfile(profiles["240-mp4"]);
			ret["360"]=getProfile(profiles["360-mp4"]);
			return ret;
		}
	}catch(err){
		log.error("++++++++++++++++++++++++++++++++++++",err);
		log.error("++++++++++++++++++++++++++++++++++++",err);
		log.error(repo,err);
		process.exit(0);
	}
}

function createEmptyArray(obj){
	return [];
}

function createLangs(langs){
	if (!langs){
		return [];
	} else {
		try {
			var ret=[];
			$.each(langs,function(index,value){
				value=value.toLowerCase();
				if (!value){
					ret.push("und");
					
				} else if (value.indexOf("und") !== -1){
					ret.push("Epañol");
				} else if (value.indexOf("spa") !== -1){
					ret.push("Epañol");
				} else if (value.indexOf("eng") !== -1){
					ret.push("English");
				} else if (value.indexOf("ita") !== -1){
					ret.push("Italiano");
				} else if (value.indexOf("fre") !== -1){
					ret.push("Français");
				} else if (value.indexOf("ger") !== -1){
					ret.push("Deutsch");
				} else if (value.indexOf("cat") !== -1){
					ret.push("Català");
				} else if (typeof value === "number"){
					ret.push("Epañol");				
				} else if (value === "-"){
					ret.push("indet");				
				} else if (value.indexOf("-") !== -1){
					var lang=value.substring(value.indexOf("-"), value.length);
					ret.push(lang);
				} else {
					ret.push("indet");				
				}
			});
		
			return ;
		}catch(err){
			log.error("++++++++++++++++++++++++++++++++++++",err);
			log.error("++++++++++++++++++++++++++++++++++++",err);
			log.error("++++++++++++++++++++++++++++++++++++",err);
			log.error("++++++++++++++++++++++++++++++++++++",err);
			
			log.error("Exit",err);
			process.exit(0);
		}
	}
}

function createLanguajes(repo){
	return createLangs(repo.languages);
}

function createSubtitles(repo){
	return createLangs(repo.subtitles);
}

//           "video": {
//             "0": [
//               {
//                 "server": "hn",
//                 "url": "/Homeland-101.mp4/default/Homeland-101.mp4"
//               }
//             ],
//             "240": [
//               {
//                 "server": "hn",
//                 "url": "/Homeland-101.mp4/240-mp4/Homeland-101.mp4.mp4"
//               }
//             ],
//             "360": [
//               {
//                 "server": "ht",
//                 "url": "/Homeland-101.mp4/360-mp4/Homeland-101.mp4.mp4"
//               }
//             ]
//           },
//   "profiles": {
//     "360-mp4": {
//       "profileId": "360-mp4",
//       "videoPath": "/Homeland-101.mp4/360-mp4/Homeland-101.mp4.mp4",
//       "sizeHuman": "198.599 MB",
//       "videoResolution": "640x360",
//       "height": 360,
//       "date": null,
//       "dateTime": "05/08/2015 15:44:35 +0200",
//       "servers": [
//         {
//           "id": "ht",
//           "url": "http://ht.tv-vip.com/transcoder"
//         }
//       ]
//     },
//     "240-mp4": {
//       "profileId": "240-mp4",
//       "videoPath": "/Homeland-101.mp4/240-mp4/Homeland-101.mp4.mp4",
//       "sizeHuman": "127.023 MB",
//       "videoResolution": "426x240",
//       "height": 240,
//       "date": null,
//       "dateTime": "05/08/2015 15:44:35 +0200",
//       "servers": [
//         {
//           "id": "hn",
//           "url": "http://hn.tv-vip.com/transcoder"
//         },
//         {
//           "id": "ovh2",
//           "url": "http://s2.tv-vip.com/transcoder"
//         }
//       ]
//     },
//     "default": {
//       "profileId": "default",
//       "videoPath": "/Homeland-101.mp4/default/Homeland-101.mp4",
//       "sizeHuman": "1.23 GB",
//       "videoResolution": "1280x720",
//       "height": 720,
//       "date": null,
//       "dateTime": "09/01/2016 15:40:37 +0100",
//       "servers": [
//         {
//           "id": "hn",
//           "url": "http://hn.tv-vip.com/transcoder"
//         }
//       ]
//     }
//   },


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
