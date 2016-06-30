/* util.js */

(function(cxt) {
  "use strict";

  var util = {};

  util.hasProperty = function hasProperty(obj, keys) {
    if(!obj) {
      return false;
    }

    for(var i = 0, l = keys.length; i < l; i = i + 1) {
      var key = keys[i];

      if(obj[key] === void 0) {
        return false;
      }
    }

    return true;
  };

  util.isMysql = function isMysql(knex) {
    return knex.client.config.client === "mysql";
  };

  util.isPostgres = function isPostgres(knex) {
    return knex.client.config.client === "pg";
  };

  util.isSqlite = function isSqlite(knex) {
    return knex.client.config.client === "sqlite3";
  };

  util._date = function _date(knex, d) {
//    if(util.isSqlite(knex)) {
      var year = d.getFullYear() + "",
          month = (d.getMonth() + 1) + "",
          date = d.getDate() + "",
          hour = d.getHours() + "",
          minute = d.getMinutes() + "",
          second = d.getSeconds() + "";

      if(month.length === 1) {
        month = "0" + month;
      }
      if(date.length === 1) {
        date = "0" + date;
      }
      if(hour.length === 1) {
        hour = "0" + hour;
      }
      if(minute.length === 1) {
        minute = "0" + minute;
      }
      if(second.length === 1) {
        second = "0" + second;
      }

      return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;

//    } else if(util.isMysql(knex)) {
//      return (new Date()).toString();
//
//    } else if(util.isPostgres(knex)) {
//      return null;
//    }
  };

  util._columns = function(arr) {
    return function($, _) {
      for(var i = 0, l = arr.length; i < l; i = i + 1) {
        $(_[arr[i]]).as(arr[i]);
      }
    };
  };

  util._string = function _string(val) {
    if(val === void 0) { return void 0; }
    if(val === null) { return null; }
    return val + "";
  };

  util._int = function _int(val) {
    if(val === void 0) { return void 0; }
    if(val === null) { return null; }
    return val|0;
  };

  util._double = function _double(val) {
    if(val === void 0) { return void 0; }
    if(val === null) { return null; }
    return +val;
  };


  cxt.util = util;

}(this));
