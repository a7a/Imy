/* ERROR.js */

(function(cxt) {
  "use strict";

  var ERROR = {
    "config_error": function(name, method) {
      return function(mess) {
        return new Error("ConfigError " + name + "#" + method + " : " + mess);
      };
    },
    "database_error": function(name, method) {
      return new Error("DatabaseError: " + name + "#" + method);
    },
    "unsupported_client": function(name) {
      return new Error("UnsupportedClient: " + name);
    },
    "data_duplicate": function(type, content) {
      return new Error("DataDuplicate: type=" + type + ", content=" + content);
    },
    "no_transaction": function(method) {
      return new Error("NoTransaction: " + method);
    },
    "not_registry_data": function(type, content) {
      return new Error("NotRegistryData: type=" + type + ", content=" + content);
    }
  };


  cxt.ERROR = ERROR;

}(this));
