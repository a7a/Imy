/* ImyDBKnex.param.js */

(function(cxt) {
  "use strict";

  var _util = require("../lib/util.js").util;

  var ImyDBKnex = {
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

  ImyDBKnex.search = {
    "index.for_type_values": function(knex, where) {
      if(_util.hasProperty(where, ["type", "values"])) {
        return knex
        .select(
          "type"
          , "data_id"
          , "value"
          , "content_pos1 as d_content_pos1"
          , "content_pos2 as d_content_pos2"
          , "sort_flag"
        )
        .from(ImyDBKnex.idx.name)
        .where("type", "=", where.type)
        .andWhereIn("value", where.value)
        .groupBy(["group", "type", "data_id", "value", "content_pos1", "content_pos2"])
        .orderBy(["group", "type", "data_id", "content_pos1", "content_pos2", "value"]);
      }
    },

    "parametered_fragment.for_type_values": function(knex, where) {
      if(_util.hasProperty(where, ["type", "values"])) {
        return knex
        .select(
          "p.type as type"
          , "p.data_id as data_id"
          , "f.value as value"
          , "p.content_pos1 as d_content_pos1"
          , "p.content_pos2 as d_content_pos2"
          , "p.sort_flag as sort_flag"
        )
        .from(ImyDBKnex.fr.name + " as f")
        .innerJoin(ImyDBKnex.pa.name + " as p", function() {
          this
          .on("f.type", "=", "p.type")
          .on("f.id", "=", "p.idx_fragment_id")
          ;
        })
        .where("f.type", "=", where.type)
        .whereIn("f.value", where.values)
        .groupBy(["p.type", "p.data_id", "f.value", "p.content_pos1", "p.content_pos2"])
        .orderBy(["p.type", "p.data_id", "p.content_pos1", "p.content_pos2", "f.value"]);
      }
    }
  };

  ImyDBKnex.count = {
    "index.for_type_value": function(knex, where) {
      if(_util.hasProperty(where, ["type", "value"])) {
        return knex
        .count()
        .from(ImyDBKnex.idx.name)
        .where("type", "=", where.type)
        .andWhere("value", "=", where.value);
      }
    },

    "parametered_fragment.for_type_value": function(knex, where) {
      if(_util.hasProperty(where, ["type", "value"])) {
        return knex
        .count()
        .from(ImyDBKnex.fr.name + " as f")
        .innerJoin(ImyDBKnex.pa.name + " as p", function() {
          this
          .on("f.type", "=", "p.type")
          .on("f.id", "=", "p.idx_fragment_id")
          ;
        })
        .where("f.type", "=", where.type)
        .andWhere("f.value", "=", where.value);
      }
    }
  };

  // ************************************************

  ImyDBKnex.idx.create = function(knex) {
    return knex.schema
    .createTable(this.name, function(table) {
      table.increments();
      table.string("type", 100);
      table.string("value", 2);
      table.biginteger("data_id");
      table.integer("content_pos1");
      table.integer("content_pos2");
      table.integer("sort_flag")
      table.integer("skip");

      if(_util.isMysql(knex)) {
        table.engine("InnoDB");
      }
    });
  };

  ImyDBKnex.idx.drop = function(knex) {
    return knex.schema
    .dropTable(this.name);
  };

  ImyDBKnex.idx.index = [
    {
      columns: ["type", "value", "skip", "data_id", "content_pos1", "content_pos2"],
      name: "imy_index_idx1",
      "create": function(knex) {
        var that = this;

        return knex.schema
        .table(ImyDBKnex.idx.name, function(table) {
          table.index(that.columns, that.name);
        });
      },
      "drop": function(knex) {
        var that = this;

        return knex.schema
        .table(ImyDBKnex.idx.name, function(table) {
          table.dropIndex(that.columns, that.name);
        });
      }
    }
  ];

  ImyDBKnex.idx.select = {
  };

  ImyDBKnex.idx.insert = function(knex, value) {
    if(_util.hasProperty(value, [this.all_columns])) {
      var data = {
        type: value.type,
        value: value.value,
        data_id: value.data_id,
        content_pos1: value.content_pos1,
        content_pos2: value.content_pos2,
        skip: value.skip
      };

      return knex
      .insert(data)
      .into(this.name);
    }
  };

  ImyDBKnex.idx.delete = {
    "all": function(knex) {
      return knex
      .from(this.name)
      .del();
    }.bind(ImyDBKnex.idx),

    "for_dataid": function(knex, where) {
      if(_util.hasProperty(where, ["data_id"])) {
        return knex
        .from(this.name)
        .where("data_id", "=", where.data_id)
        .del();
      }
    }.bind(ImyDBKnex.idx)
  };

  // ************************************************

  ImyDBKnex.fr.create = function(knex) {
    return knex.schema
    .createTable(this.name, function(table) {
      table.increments();
      table.string("type", 100);
      table.string("value", 2);
      table.unique(["type", "value"]);

      if(_util.isMysql(knex)) {
        table.engine("InnoDB");
      }
    });
  };

  ImyDBKnex.fr.drop = function(knex) {
    return knex.schema
    .dropTable(this.name);
  };

  ImyDBKnex.fr.select = {
    "all": function(knex) {
      return knex
      .select(this.all_columns.concat("id"))
      .from(this.name);
    }.bind(ImyDBKnex.fr),

    "id.for_type_value": function(knex, where) {
      if(_util.hasProperty(where, ["type", "value"])) {
        return knex
        .select("id")
        .from(this.name)
        .where("type", "=", where.type)
        .andWhere("value", "=", where.value);
      }
    }.bind(ImyDBKnex.fr)
  };

  ImyDBKnex.fr.insert = function(knex, values) {
    if(_util.hasProperty(values, this.all_columns)) {
      var data = {
        type: values.type,
        value: values.value
      };

      return knex
      .insert(data)
      .into(this.name);
    }
  };

  ImyDBKnex.fr.delete = {
    "all": function(knex) {
      return knex
      .from(this.name)
      .del();
    }.bind(ImyDBKnex.fr),

    "for_type_value": function(knex, where) {
      if(_util.hasProperty(where, ["type", "value"])) {
        return knex
        .from(this.name)
        .where("type", "=", where.type)
        .andWhere("value", "=", where.value)
        .del();
      }
    }.bind(ImyDBKnex.fr)
  };

  // ************************************************

  ImyDBKnex.pa.create = function(knex) {
    return knex.schema
    .createTable(this.name, function(table) {
      table.increments();
      table.biginteger("idx_fragment_id");
      table.string("type", 100);
      table.biginteger("data_id");
      table.integer("content_pos1");
      table.integer("content_pos2");
      table.integer("sort_flag")
      table.integer("skip");

      if(_util.isMysql(knex)) {
        table.engine("InnoDB");
      }
    });
  };

  ImyDBKnex.pa.drop = function(knex) {
    return knex.schema
    .dropTable(this.name);
  };

  ImyDBKnex.pa.index = [
    {
      "name": "imy_idx_parameter_idx1",
      "columns": ["type", "idx_fragment_id", "skip", "data_id", "content_pos1", "content_pos2"],
      "create": function(knex) {
        var that = this;

        return knex.schema
        .table(ImyDBKnex.pa.name, function(table) {
          table.index(that.columns, that.name);
        });
      },
      "drop": function(knex) {
        var that = this;

        return knex.schema
        .table(ImyDBKnex.pa.name, function(table) {
          table.dropIndex(that.columns, that.name);
        });
      }
    }
  ];

  ImyDBKnex.pa.select = {
    "all": function(knex) {
      return knex
      .select(this.all_columns)
      .from(this.name);
    }.bind(ImyDBKnex.pa)
  };

  ImyDBKnex.pa.insert = function(knex, values) {
    if(_util.hasProperty(values, this.all_columns)) {
      var data = {
        type: values.type,
        idx_fragment_id: values.idx_fragment_id,
        data_id: values.data_id,
        content_pos1: values.content_pos1,
        content_pos2: values.content_pos2,
        sort_flag: values.sort_flag,
        skip: values.skip
      };

      return knex
      .insert(data)
      .into(this.name);
    }
  };

  ImyDBKnex.pa.delete = {
    "all": function(knex) {
      return knex
      .from(this.name)
      .del();
    }.bind(ImyDBKnex.pa),
    "for_dataid": function(knex, where) {
      if(_util.hasProperty(where, ["data_id"])) {
        return knex
        .from(this.name)
        .where("data_id", "=", where.data_id)
        .del();
      }
    }.bind(ImyDBKnex.pa)
  };

  // ************************************************

  ImyDBKnex.da.create = function(knex) {
    return knex.schema
    .createTable(this.name, function(table) {
      table.increments();
      table.string("type", 100).notNullable();
      table.text("content");
      //table.timestamps();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at");

      if(_util.isMysql(knex)) {
        table.engine("InnoDB");
      }
    });
  };

  ImyDBKnex.da.drop = function(knex) {
    return knex.schema
    .dropTable(this.name);
  };

  ImyDBKnex.da.index = [
    {
      "columns": ["type", { "content": 255 }],
      "name": "imy_data_idx1",
      "create": function(knex) {
        var that = this,
            columns = [],
            column = null,
            i = 0, l = 0,
            key = "";

        if(_util.isMysql(knex)) {
          for(i = 0, l = that.columns.length; i < l; i = i + 1) {
            column = that.columns[i];

            if(typeof column === "string") {
              columns[columns.length] = "`" + column + "`";
            } else {
              key = Object.keys(column)[0];

              columns[columns.length] = "`" + key + "`" + "(" + column[key] + ")";
            }
          }

          return knex.raw(
            "alter table `" + ImyDBKnex.da.name + "` " +
            "add index " + that.name + "(" + columns.join(",") + ")"
          );

        } else {
          for(i = 0, l = that.columns.length; i < l; i = i + 1) {
            column = that.columns[i];

            if(typeof column === "string") {
              columns[columns.length] = column;
            } else {
              key = Object.keys(column)[0];

              columns[columns.length] = key;
            }
          }

          return knex.schema
          .table(ImyDBKnex.da.name, function(table) {
            table.index(columns, that.name);
          });
        }
      },
      "drop": function(knex) {
        var that = this;

        return knex.schema
        .table(ImyDBKnex.da.name, function(table) {
          table.dropIndex(that.columns, that.name);
        });
      }
    }
  ];

  ImyDBKnex.da.select = {
    "all.for": function(knex, where) {
      var query = knex
      .select(this.all_columns)
      .from(this.name);

      if(_util.hasProperty(where, ["id"])) {
        query.where("id", "=", where.id);
      }
      if(_util.hasProperty(where, ["type"])) {
        query.where("type", "=", where.type);
      }
      if(_util.hasProperty(where, ["content"])) {
        query.where("content", "=", where.content);
      }

      return query;
    }.bind(ImyDBKnex.da)
  };

  ImyDBKnex.da.insert = function(knex, values) {
    if(_util.hasProperty(values, ["type", "content"])) {
      var data = {
        type: values.type,
        content: values.content
      };

      return knex
      .insert(data)
      .into(this.name);
    }
  };

  ImyDBKnex.da.update = {
    "for": function(knex, set, where) {
      var data = {};

      if(_util.hasProperty(set, ["content"])) {
        data.content = set.content;
      }
      if(_util.hasProperty(set, ["type"])) {
        data.type = set.type;
      }
      data.updated_at = _util._date(knex, new Date());

      var query = knex.from(this.name)
      .update(data);

      if(_util.hasProperty(where, ["id"])) {
        query.where("id", "=", where.id);
      }
      if(_util.hasProperty(where, ["type"])) {
        query.where("type", "=", where.type);
      }
      if(_util.hasProperty(where, ["content"])) {
        query.where("content", "=", where.content);
      }

      return query;
    }.bind(ImyDBKnex.da)
  };

  ImyDBKnex.da.delete = {
    "all": function(knex) {
      return knex
      .from(this.name)
      .del();
    }.bind(ImyDBKnex.da),

    "for": function(knex, where) {
      if(_util.hasProperty(where, ["id"])) {
        var query = knex
        .from(this.name)
        .where("id", "=", where.id);

        return query
        .del();
      }

    }.bind(ImyDBKnex.da)
  };

  cxt.ImyDBKnex = ImyDBKnex;

}(this));
