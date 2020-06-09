"use strict"

exports.imghost = "http://localhost:5000/images/";

exports.err = function(msg){
    
    let a = {
        "status":"403",
        "message":msg
    };
    return a;

}

exports.clienterr = function(msg){
    let b = {
        "status":"400",
        "message":msg
    };
    return b;

}
exports.unauth = function(msg){
    let c = {
        "status":"401",
        "message":msg
    }; 
    return c;

}

exports.ok = function(msg){
    return {
        "status":"200",
        "message":msg
    };
}
exports.server = function(msg){
    let d = {
        "status":"500",
        "message":msg
    }; 
    return d

}

exports.customMsg = function(code,msg,object){
    let e = {
        "status":code,
        "message":msg,
        "obj":object
    };
    return e

}

exports.privateKey = '!@#$%^&*()+';
