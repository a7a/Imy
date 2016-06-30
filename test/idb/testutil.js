(function(cxt, global) {
  "use strict";

  var ng_count = 0,
      write_buffer = "";

  var getValue = function getValue(name) {
    if(name === "ng_count") {
      return ng_count;
    } else {
      return null;
    }
  };

  var write = function write(x) {
    var str = "";

    if(typeof x === "string") {
      str = x;

    } else if(Array.isArray(x)) {
      if(x.length === 0) {
        str = "[ ]";
      } else {
        str = "[" + x.join(", ") + "]";
      }
    }

    write_buffer += str + "<br>";
  };
  var flush = function flush() {
    document.getElementById("result").innerHTML = write_buffer
      + "<br>"
      + document.getElementById("result").innerHTML;

    write_buffer = "";
  };

  var test = function test(name, proc) {
    write(name + " start");

    return new Promise(function(fulfill) {
      proc(function(result, message) {
        if(Array.isArray(result)) {
          for(var i = 0, l = result.length; i < l; i = i + 1) {
            var res = result[i][0],
                mess = result[i][1];

            if(!res) {
              ng_count++;
            }
            write((res ? "OK" : "NG") + " : " + mess);
          }

        } else {
         if(!result) {
           ng_count++;
         }
         write((result ? "OK" : "NG") + " : " + message);
         write(name + " end");
        }

        flush();
        fulfill();
      });
    });
  };

  var assert = function assert(result, mess) {
    if(!result) {
      throw new Error(mess + " NG");
    }
    write(mess + " OK");
  };

  var match_array = function match_array(arr1, arr2) {
    if(arr1.length !== arr2.length) {
      return false;
    }

    for(var i = 0, l = arr1.length; i < l; i = i + 1) {
      if(arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  };

  var match_object = function match_object(obj1, obj2) {
    var keys1 = Object.keys(obj1),
        keys2 = Object.keys(obj2);

    if(keys1.length !== keys2.length) {
      return false;
    }

    for(var i = 0, l = keys1.length; i < l; i = i +1) {
      var key = keys1[i];

      if(obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  };


  cxt.getValue = global.getValue = getValue;
  cxt.write = global.write = write;
  cxt.flush = global.flush = flush;
  cxt.test = global.test = test;
  cxt.assert = global.assert = assert;
  cxt.match_array = global.match_array = match_array;
  cxt.match_object = global.match_object = match_object;

}(this, (0, eval)("this")))
