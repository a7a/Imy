/* ImyDBSLI2.param.js */

(function(cxt) {
  "use strict";

  var SyncPromise = require("../lib/SyncPromise.js").SyncPromise,
      _util = require("../lib/util.js").util;

  var ImyDBSLI2 = {
    idx: {
      name: "imy_indices",
      all_columns: ["type", "value", "data_id", "content_pos1", "content_pos2", "sort_flag", "skip"],
      create: null,
      drop: null,
      index: [],
      select: {},
      insert: null,
      update: {},
      delete: {}
    },
    fr: {
      name: "imy_idx_fragments",
      all_columns: ["type", "value"],
      create: null,
      drop: null,
      index: [],
      select: {},
      insert: null,
      update: {},
      delete: {}
    },
    pa: {
      name: "imy_idx_parameters",
      all_columns: [
        "type"
        , "idx_fragment_id"
        , "skip"
        , "data_id"
        , "content_pos1"
        , "content_pos2"
        , "sort_flag"
      ],
      create: null,
      drop: null,
      index: [],
      select: {},
      insert: null,
      update: {},
      delete: {}
    },
    da: {
      name: "imy_data",
      all_columns: [
        "id"
        , "type"
        , "content"
        , "created_at"
        , "updated_at"
      ],
      create: null,
      drop: null,
      index: [],
      select: {},
      insert: null,
      update: {},
      delete: {}
    }
  };


  // ************************************************

  ImyDBSLI2.search = {
    "index.for_type_values": function(sli2, where) {
      if(_util.hasProperty(where, ["type", "values"])) {
        return new SyncPromise(function(fulfill, reject) {
          sli2
          .select(function($, _) {
            $(_.type).as("type");
            $(_.data_id).as("data_id");
            $(_.value).as("value");
            $(_.content_pos1).as("d_content_pos1");
            $(_.content_pos2).as("d_content_pos2");
            $(_.sort_flag).as("sort_flag");
          })
          .from(ImyDBSLI2.idx.name)
          .where(function($) {
            $.and("type").eq.value(where.type);
            $.and("value").in.value(where.value);
          })
          .groupBy(["group", "type", "data_id", "value", "d_content_pos1", "d_content_pos2"])
          .orderBy(["group", "type", "data_id", "d_content_pos1", "d_content_pos2", "value"])
          .run(function(rows, ok) {
            ok();
            fulfill(rows);
          })
          .catch(reject);
        });
      }
    },

    "parametered_fragment.for_type_values": function(sli2, where) {
      if(_util.hasProperty(where, ["type", "values"])) {
        return new SyncPromise(function(fulfill, reject) {
          sli2
          .select(function($, _) {
            $(_.p.type).as("type");
            $(_.p.data_id).as("data_id");
            $(_.f.value).as("value");
            $(_.p.content_pos1).as("d_content_pos1");
            $(_.p.content_pos2).as("d_content_pos2");
            $(_.p.sort_flag).as("sort_flag");
          })
          .from(ImyDBSLI2.fr.name).as("f")
          .innerJoin(ImyDBSLI2.pa.name, function($) {
            $.and("f.type").eq.key("p.type");
            $.and("f.id").eq.key("p.idx_fragment_id");
          }).as("p")
          .where(function($) {
            $.and("f.type").eq.value(where.type);
            $.and("f.value").in.value(where.values);
          })
          .groupBy(["type", "data_id", "value", "d_content_pos1", "d_content_pos2"])
          .orderBy(["type", "data_id", "d_content_pos1", "d_content_pos2", "value"])
          .run(function(rows, ok) {
            ok();
            fulfill(rows);
          })
          .catch(reject);
        });
      }
    }
  };

  ImyDBSLI2.count = {
    "index.for_type_value": function(sli2, where) {
      if(_util.hasProperty(where, ["type", "value"])) {
        return new SyncPromise(function(fulfill, reject) {
          sli2
          .select(function($, _) {
            $.count(_.id);
          })
          .from(ImyDBSLI2.idx.name)
          .where(function($) {
            $.and("type").eq.value(where.type);
            $.and("value").eq.value(where.value);
          })
          .run(function(rows, ok) {
            ok();
            fulfill(rows);
          })
          .catch(reject);
        });
      }
    },

    "parametered_fragment.for_type_value": function(sli2, where) {
      if(_util.hasProperty(where, ["type", "value"])) {
        return new SyncPromise(function(fulfill, reject) {
          sli2
          .select(function($, _) {
            $.count(_.f.id);
          })
          .from(ImyDBSLI2.fr.name).as("f")
          .innerJoin(ImyDBSLI2.pa.name, function($) {
            $.and("f.type").eq.key("p.type");
            $.and("f.id").eq.key("p.idx_fragment_id");
          }).as("p")
          .where(function($) {
            $.and("f.type").eq.value(where.type);
            $.and("f.value").eq.value(where.value);
          })
          .groupBy(["f.id"])
          .run(function(rows, ok) {
            ok();
            fulfill(rows);
          })
          .catch(reject);
        });
      }
    }
  };

  // ************************************************

  ImyDBSLI2.idx.create = function(sli2) {
    var that = this;

    return new SyncPromise(function(fulfill, reject) {
      sli2
      .createTable(that.name, { keyPath: "id", autoIncrement: true })
      /* schema
        id increment
        type string(100)
        value string(2)
        data_id biginteger
        content_pos1 integer
        content_pos2 integer
        sort_flag integer
        skip integer
      */
      .run(function(ret, ok) {
        ok();
        fulfill(ret);
      })
      .catch(reject);
    });
  };

  ImyDBSLI2.idx.drop = function(sli2) {
    var that = this;

    return new SyncPromise(function(fulfill, reject) {
      sli2
      .dropTable(that.name)
      .run(function(ret, ok) {
        ok();
        fulfill(ret);
      })
      .catch(reject);
    });
  };

  ImyDBSLI2.idx.index = [
    {
      columns: ["type", "value", "skip", "data_id", "content_pos1", "content_pos2"],
      name: "imy_index_idx1",
      "create": function(sli2) {
        var that = this;

        return new SyncPromise(function(fulfill, reject) {
          sli2
          .createIndex(ImyDBSLI2.idx.name, that.name, that.columns)
          .run(function(ret, ok) {
            ok();
            fulfill(ret);
          })
          .catch(reject);
        });
      },
      "drop": function(sli2) {
        var that = this;

        return new SyncPromise(function(fulfill, reject) {
          sli2
          .dropIndex(ImyDBSLI2.idx.name, that.name)
          .run(function(ret, ok) {
            ok();
            fulfill(ret);
          })
          .catch(reject);
        });
      }
    }
  ];

  ImyDBSLI2.idx.select = {
  };

  ImyDBSLI2.idx.insert = function(sli2, value) {
    if(_util.hasProperty(value, [this.all_columns])) {
      var that = this;
      var data = {
        type: value.type,
        value: value.value,
        data_id: value.data_id,
        content_pos1: value.content_pos1,
        content_pos2: value.content_pos2,
        skip: value.skip
      };

      return new SyncPromise(function(fulfill, reject) {
        sli2
        .insertInto(that.name)
        .values(data)
        .run(function(ret, ok) {
          ok();
          fulfill(ret);
        })
        .catch(reject);
      });
    }
  };

  ImyDBSLI2.idx.delete = {
    "all": function(sli2) {
      var that = this;

      return new SyncPromise(function(fulfill, reject) {
        sli2
        .deleteFrom(that.name)
        .run(function(ret, ok) {
          ok();
          fulfill(ret);
        })
        .catch(reject);
      });
    }.bind(ImyDBSLI2.idx),

    "for_dataid": function(sli2, where) {
      var that = this;

      if(_util.hasProperty(where, ["data_id"])) {
        return new SyncPromise(function(fulfill, reject) {
          sli2
          .deleteFrom(that.name)
          .where(function($) {
            $.and("data_id").eq.value(where.data_id);
          })
          .run(function(ret, ok) {
            ok();
            fulfill(ret);
          })
          .catch(reject);
        });
      }
    }.bind(ImyDBSLI2.idx)
  };

  // ************************************************

  ImyDBSLI2.fr.create = function(sli2) {
    var that = this;

    return new SyncPromise(function(fulfill, reject) {
      sli2
      .createTable(that.name, { keyPath: "id", autoIncrement: true })
      /* schema
        id increment
        type string(100)
        value string(2)
      */
      .run(function(ret, ok) {
        ok();
        fulfill(ret);
      })
      .catch(reject);
    });
  };

  ImyDBSLI2.fr.drop = function(sli2) {
    var that = this;

    return new SyncPromise(function(fulfill, reject) {
      sli2
      .dropTable(that.name)
      .run(function(ret, ok) {
        ok();
        fulfill(ret);
      })
      .catch(reject);
    });
  };

  ImyDBSLI2.fr.select = {
    "all": function(sli2) {
      var that = this;

      return new SyncPromise(function(fulfill, reject) {
        sli2
        .select(_util._columns(that.all_columns.concat("id")))
        .from(that.name)
        .run(function(rows, ok) {
          ok();
          fulfill(rows);
        })
        .catch(reject);
      });
    }.bind(ImyDBSLI2.fr),

    "id.for_type_value": function(sli2, where) {
      if(_util.hasProperty(where, ["type", "value"])) {
        var that = this;

        return new SyncPromise(function(fulfill, reject) {
          sli2
          .select(function($, _) {
            $(_.f.id).as("id");
          })
          .from(that.name).as("f")
          .where(function($) {
            // TODO
            $.and("f.type").eq.value(where.type);
            $.and("f.value").eq.value(where.value);
          })
          .run(function(rows, ok) {
            ok();
            fulfill(rows);
          })
          .catch(reject);
        });
      }
    }.bind(ImyDBSLI2.fr)
  };

  ImyDBSLI2.fr.insert = function(sli2, values) {
    if(_util.hasProperty(values, this.all_columns)) {
      var that = this;
      var data = {
        type: values.type,
        value: values.value
      };

      return new SyncPromise(function(fulfill, reject) {
        sli2
        .insertInto(that.name)
        .values(data)
        .run(function(ret, ok) {
          ok();
          fulfill(ret);
        })
        .catch(reject);
      });
    }
  };

  ImyDBSLI2.fr.delete = {
    "all": function(sli2) {
      var that = this;

      return new SyncPromise(function(fulfill, reject) {
        sli2
        .deleteFrom(that.name)
        .run(function(ret, ok) {
          ok();
          fulfill(ret);
        })
        .catch(reject);
      });
    }.bind(ImyDBSLI2.fr),

    "for_type_value": function(sli2, where) {
      if(_util.hasProperty(where, ["type", "value"])) {
        var that = this;

        return new SyncPromise(function(fulfill, reject) {
          sli2
          .deleteFrom(that.name)
          .where(function($) {
            $.and("type").eq.value(where.type);
            $.and("value").eq.value(where.value);
          })
          .run(function(ret, ok) {
            ok();
            fulfill(ret);
          })
          .catch(reject);
        });
      }
    }.bind(ImyDBSLI2.fr)
  };

  // ************************************************

  ImyDBSLI2.pa.create = function(sli2) {
    var that = this;

    return new SyncPromise(function(fulfill, reject) {
      sli2
      .createTable(that.name, { keyPath: "id", autoIncrement: true })
      /* schema
        id increment
        idx_fragment_id biginteger
        type string(100)
        data_id biginteger
        content_pos1 integer
        content_pos2 integer
        sort_flag integer
        skip integer
      */
      .run(function(ret, ok) {
        ok();
        fulfill(ret);
      })
      .catch(reject);
    });
  };

  ImyDBSLI2.pa.drop = function(sli2) {
    var that = this;

    return new SyncPromise(function(fulfill, reject) {
      sli2
      .dropTable(that.name)
      .run(function(ret, ok) {
        ok();
        fulfill(ret);
      })
      .catch(reject);
    });
  };

  ImyDBSLI2.pa.index = [
    {
      "name": "imy_idx_parameter_idx1",
      "columns": ["type", "idx_fragment_id", "skip", "data_id", "content_pos1", "content_pos2"],
      "create": function(sli2) {
        var that = this;

        return new SyncPromise(function(fulfill, reject) {
          sli2
          .createIndex(ImyDBSLI2.pa.name, that.name, that.columns)
          .run(function(ret, ok) {
            ok();
            fulfill(ret);
          })
          .catch(reject);
        });
      },
      "drop": function(sli2) {
        var that = this;

        return new SyncPromise(function(fulfill, reject) {
          sli2
          .dropIndex(ImyDBSLI2.pa.name, that.name)
          .run(function(ret, ok) {
            ok();
            fulfill(ret);
          })
          .catch(reject);
        });
      }
    }
  ];

  ImyDBSLI2.pa.select = {
    "all": function(sli2) {
      var that = this;

      return new SyncPromise(function(fulfill, reject) {
        sli2
        .select(_util._columns(that.all_columns))
        .from(that.name)
        .run(function(rows, ok) {
          ok();
          fulfill(rows);
        })
        .catch(reject);
      });
    }.bind(ImyDBSLI2.pa)
  };

  ImyDBSLI2.pa.insert = function(sli2, values) {
    if(_util.hasProperty(values, this.all_columns)) {
      var that = this;
      var data = {
        type: values.type,
        idx_fragment_id: values.idx_fragment_id,
        data_id: values.data_id,
        content_pos1: values.content_pos1,
        content_pos2: values.content_pos2,
        sort_flag: values.sort_flag,
        skip: values.skip
      };

      return new SyncPromise(function(fulfill, reject) {
        sli2
        .insertInto(that.name)
        .values(data)
        .run(function(ret, ok) {
          ok();
          fulfill(ret);
        })
        .catch(reject);
      });
    }
  };

  ImyDBSLI2.pa.delete = {
    "all": function(sli2) {
      var that = this;

      return new SyncPromise(function(fulfill, reject) {
        sli2
        .deleteFrom(that.name)
        .run(function(ret, ok) {
          ok();
          fulfill(ret);
        })
        .catch(reject);
      });
    }.bind(ImyDBSLI2.pa),

    "for_dataid": function(sli2, where) {
      var that = this;

      if(_util.hasProperty(where, ["data_id"])) {
        return new SyncPromise(function(fulfill, reject) {
          sli2
          .deleteFrom(that.name)
          .where(function($) {
            $.and("data_id").eq.value(where.data_id);
          })
          .run(function(ret, ok) {
            ok();
            fulfill(ret);
          })
          .catch(reject);
        });
      }
    }.bind(ImyDBSLI2.pa)
  };

  // ************************************************

  ImyDBSLI2.da.create = function(sli2) {
    var that = this;

    return new SyncPromise(function(fulfill, reject) {
      sli2
      .createTable(that.name, { keyPath: "id", autoIncrement: true })
      /* schema
        id increment
        type string(100)
        content text
        created_at timestamp default current_timestamp
        updated_at timestamp default null on update current_timestamp
      */
      .run(function(ret, ok) {
        ok();
        fulfill(ret);
      })
      .catch(reject);
    });
  };

  ImyDBSLI2.da.drop = function(sli2) {
    var that = this;

    return new SyncPromise(function(fulfill, reject) {
      sli2
      .dropTable(that.name)
      .run(function(ret, ok) {
        ok();
        fulfill(ret);
      })
      .catch(reject);
    });
  };

  ImyDBSLI2.da.index = [
    {
      "columns": ["type", "content" ],
      "name": "imy_data_idx1",
      "create": function(sli2) {
        var that = this;

        return new SyncPromise(function(fulfill, reject) {
          sli2
          .createIndex(ImyDBSLI2.da.name, that.name, that.columns)
          .run(function(ret, ok) {
            ok();
            fulfill(ret);
          })
          .catch(reject);
        });
      },
      "drop": function(sli2) {
        var that = this;

        return new SyncPromise(function(fulfill, reject) {
          sli2
          .dropIndex(ImyDBSLI2.da.name, that.name)
          .run(function(ret, ok) {
            ok();
            fulfill(ret);
          })
          .catch(reject);
        });
      }
    }
  ];

  ImyDBSLI2.da.select = {
    "all.for": function(sli2, where) {
      var that = this;

      return new SyncPromise(function(fulfill, reject) {
        sli2
        .select(_util._columns(that.all_columns))
        .from(that.name)
        .where(function($) {
          if(_util.hasProperty(where, ["id"])) {
            $.and("id").eq.value(where.id);
          }
          if(_util.hasProperty(where, ["type"])) {
            $.and("type").eq.value(where.type);
          }
          if(_util.hasProperty(where, ["content"])) {
            $.and("content").eq.value(where.content);
          }
        })
        .run(function(rows, ok) {
          ok();
          fulfill(rows);
        })
        .catch(reject);
      });
    }.bind(ImyDBSLI2.da)
  };

  ImyDBSLI2.da.insert = function(sli2, values) {
    if(_util.hasProperty(values, ["type", "content"])) {
      var that = this;
      var data = {
        type: values.type,
        content: values.content
      };

      return new SyncPromise(function(fulfill, reject) {
        sli2
        .insertInto(that.name)
        .values(data)
        .run(function(ret, ok) {
          ok();
          fulfill(ret);
        })
        .catch(reject);
      });
    }
  };

  ImyDBSLI2.da.update = {
    "for": function(sli2, set, where) {
      var that = this;
      var data = {};

      if(_util.hasProperty(set, ["content"])) {
        data.content = set.content;
      }
      if(_util.hasProperty(set, ["type"])) {
        data.type = set.type;
      }
      data.updated_at = _util._date(sli2, new Date());

      return new SyncPromise(function(fulfill, reject) {
        sli2
        .update(that.name)
        .set(data)
        .where(function($) {
          if(_util.hasProperty(where, ["id"])) {
            $.and("id").eq.value(where.id);
          }
          if(_util.hasProperty(where, ["type"])) {
            $.and("type").eq.value(where.type);
          }
          if(_util.hasProperty(where, ["content"])) {
            $.and("content").eq.value(where.content);
          }
        })
        .run(function(ret, ok) {
          ok();
          fulfill(ret);
        })
        .catch(reject);
      });
    }.bind(ImyDBSLI2.da)
  };

  ImyDBSLI2.da.delete = {
    "all": function(sli2) {
      var that = this;

      return new SyncPromise(function(fulfill, reject) {
        sli2
        .deleteFrom(that.name)
        .run(function(ret, ok) {
          ok();
          fulfill(ret);
        })
        .catch(reject);
      });
    }.bind(ImyDBSLI2.da),

    "for": function(sli2, where) {
      if(_util.hasProperty(where, ["id"])) {
        var that = this;

        return new SyncPromise(function(fulfill, reject) {
          sli2
          .deleteFrom(that.name)
          .where(function($) {
            $.and("id").eq.value(where.id);
          })
          .run(function(ret, ok) {
            ok();
            fulfill(ret);
          })
          .catch(reject);
        });
      }
    }.bind(ImyDBSLI2.da)
  };


  cxt.ImyDBSLI2 = ImyDBSLI2;

}(this));
