'use strict';

module.exports = function ($q,$log,config) {
	var self = {};

    function translate(path){
        return translateDefaultValue(path,path);
    }

    function translateDefaultValue(path,defaultValue){
        debugger;
        if (!path){
            return defaultValue;
        } else if (path.indexOf("article.",0)===0){
            path=path.substring("article.".length,path.length);
        }

        if (path.indexOf("form.",0)!==0){
            path="form."+path;
        }

        if (config.CONSTANTS.form[path]){
            return config.CONSTANTS.form[path].label;
        }

        return defaultValue;
    }
    
    function assignPromise(current,property,array,f,i,path){
        var value=current[property];
        
        // if the function returns a promise ...
        $q.when(self.mapArray(value,array,f,i+1,path))
            .then(function(res){
                // normal termination
                current[property]=res;
            },function(err){
                // error termination
                current[property]=err;
            },function(res){
                // notify
                current[property]=res;
            })
        ;
    }

    
    self.mapArray=function(current,array,f,i,path){
        
        if (i === array.length){
            return f(current);
        } else {
            var property=array[i];

            if (property === "LANG") {
                angular.forEach(['nl','fr','en'],function(property,index){
                    
                    if ( current[property] !== undefined) {
                        // current[property]=self.mapArray(current[property],array,f,i+1,path);
                        assignPromise(current,property,array,f,i,path);
                    }
                });
                return current;
            } else if (property === "ARRAY") {
                var currentArray=current;
                
                angular.forEach(currentArray,function(value,index){
                    //current[index]=self.mapArray(value,array,f,i+1,path);
                    assignPromise(current,index,array,f,i,path);
                });
                
                return current;
            } else {
                if ( current[property] === undefined) {
                    // console.log("Article does not have propery:"+property+
                    //             " in position:"+i+
                    //             " of path:"+path);
                    // no changes it does not exitst
                    return current;
                } else {
                    
                    // var value=current[property];
                    // current[property]=self.mapArray(value,array,f,i+1,path);
                    // if the function returns a promise ...
                    
                    assignPromise(current,property,array,f,i,path);

                    // $q.when(self.mapArray(value,array,f,i+1,path))
                    //     .then(function(res){
                    //         // normal termination
                    //         current[property]=res;
                    //     },function(err){
                    //         // error termination
                    //         current[property]=err;
                    //     },function(res){
                    //         // notify
                    //         current[property]=res;
                    //     })
                    // ;
                    return current;
                }
            }
        }
        
    };

    self.mapPath=function(article,path,f){
        if (!article|| !path){
            return;
        } else {
            // split the path
            var array=path.split(".");
            var i;
            //var current=article;

            article=self.mapArray(article,array,f,0,path);
        }    
    };

    self.map=function (article,pathsArray,f){
        if (!article|| !pathsArray || pathsArray.length===0){
            return article;
        } else {
            angular.forEach(pathsArray,function(value,key){
                self.mapPath(article,value,f);
            });

            return article;
        }
    };

    // copy the non existen structure from article org to dest
    self.match=function(dest,org){
        if (!org){
            return dest;
        } else if (!dest){
            return angular.copy(org);
        } else {
            if (typeof org === 'object'){
                for(var propertyName in org){
                    var tmp=dest[propertyName];
                    dest[propertyName]=self.match(dest[propertyName],org[propertyName]);
                    
                    // console.log(" dest: ");
                    // console.log(tmp);
                    // console.log(" + ");
                    // console.log(org[propertyName]);
                    // console.log(": Returns ->");
                    // console.log(dest[propertyName]);
                }
                return dest;
            } else {
                return dest;
            }
        }
    };
    


    /**
     * CHECK mandatory fields arrays
     */

    self.checkMandatoryFieldArray=function(current,array,i,path){
        if (i === array.length){
            // OK
            return [];
        } else {
            var property=array[i];
            var ret=[];
            
            if (property === "LANG") {
//                angular.forEach(['nl','fr','en'],function(property,index){
                angular.forEach(['nl','fr'],function(property,index){
                    
                    if ( current[property] !== undefined) {
                        // var res=self.checkMandatoryFieldArray(current[property],
                        //                                       array,i+1,path.replace("LANG",property));
                        var res=self.checkMandatoryFieldArray(current[property],
                                                              array,i+1,path+"."+property);
                        ret=ret.concat(res);
                    } else {
                        //                        ret.push("Not mandatory field: '"+path.replace("LANG",property.toUpperCase())+"' for language:"+property.toUpperCase());

                        ret.push("Not mandatory field: '"+property.toUpperCase()+" "+translate(path)+"'");
                    }

                });

                return ret;
            } else if (property === "ARRAY") {
                var currentArray=current;

                angular.forEach(currentArray,function(value,index){
                    // current[index] === value
                    var res=self.checkMandatoryFieldArray(value,
                                                          array,i+1,
//                                                          path.replace("ARRAY","["+index+"]"));
                                                          path+".["+index+"]");
                    ret=ret.concat(res);                    
                });

                return ret;
            } else if ( current[property] === undefined || current[property] === null) {
                return ["Not mandatory field: '"+translate(path+"."+property)+"'"];
            } else {
                return self.checkMandatoryFieldArray(current[property],
                                                     array,i+1,path+"."+property);
            }                        
        }        
    };
    
    self.checkMandatoryField=function(obj,field,defaultValue){
        if (!obj|| !field){
            return defaultValue;
        } else {
            // split the path
            var array=field.split(".");
            
//            return self.checkMandatoryFieldArray(obj,array,0,field);
            return self.checkMandatoryFieldArray(obj,array,0,"article");
        }    
    };

    
    // Test that the fields exists and the value is not null or undefined
    // On error returns a message array.
    // If evrerithing is on retrns an emptry array
    // defaultValue to return when something wrong happen
    self.checkMandatory=function(obj,fields,defaultValue){
        if (!obj|| !fields || fields.length===0){
            return defaultValue;
        } else {
            var ret=[];
            
            angular.forEach(fields,function(field,index){
                var array=self.checkMandatoryField(obj,field,defaultValue);
                
                ret=ret.concat(array);
            });
            return ret;
        }            
    };
    
    
    
    return self;
};

