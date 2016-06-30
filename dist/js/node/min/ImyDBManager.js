!function(e){"use strict";var n=e.SLI2||require("sli2").SLI2||e.SLI2,t=require("./lib/SyncPromise.js").SyncPromise,a=require("./param/ImyDBKnex.param.js").ImyDBKnex,r=require("./param/ImyDBSLI2.param.js").ImyDBSLI2,i=require("./param/ERROR.js").ERROR,c=function(e){return"knex"===e.name},o=function(e){return e instanceof n},d=function(e){return new t(function(n,t){c(e)?n(a):o(e)?n(r):t(i.database_error("ImyDBManager","getSQLByDB"))})},l={};l.checkObject=function(e,n,a){return c(e)?this._checkObjectForKnex(e,n,a):o(e)?this._checkObjectForSli2(e,n,a):new t(function(e,n){n(i.database_error("ImyDBManager","checkObject"))})},l._checkObjectForSli2=function(e,n,a){var r=[].slice.apply(e.db.objectStoreNames),i=0,c=0,o=0,d=0;return new t(0===r.length?function(e){e([])}:function(t){var l=[];e.beginTransaction(r,"readonly",function(){var t=[];for(i=0,c=r.length;i<c;i+=1){var f=e.tables[r[i]].store.indexNames;for(o=0,d=f.length;o<d;o+=1)t[t.length]=f[o]}if(!n||"table"===n)for(i=0,c=r.length;i<c;i+=1)(0===a.length||~a.indexOf(r[i]))&&(l[l.length]={type:"table",name:r[i]});if(!n||"index"===n)for(i=0,c=t.length;i<c;i+=1)(0===a.length||~a.indexOf(t[i]))&&(l[l.length]={type:"index",name:t[i]})}).then(function(){t(l)})})},l._checkObjectForKnex=function(e,n,a){var r=e.client.config,c=r.client,o=null;switch(c){case"mysql":var d=r.connection.database;return"table"===n?(o=e.withSchema("information_schema").select(e.raw("distinct 'table' type, table_name name")).from("statistics").where("table_schema",d),a&&(o=o.whereIn("table_name",a))):"index"===n?(o=e.withSchema("information_schema").select(e.raw("distinct 'index' type, index_name name")).from("statistics").where("index_schema",d),a&&(o=o.whereIn("index_name",a))):n||(o=e.withSchema("information_schema").select(e.raw("distinct 'table' type, table_name name")).from("statistics").where("table_schema",d).union(function(){this.withSchema("information_schema").select(e.raw("distinct 'index' type, index_name name")).from("statistics").where("index_schema",d),a&&this.whereIn("index_name",a)}),a&&(o=o.whereIn("table_name",a))),o;case"pg":var l=r.searchPath.split(",").map(function(e){return e.replace(/^\s*/,"").replace(/\s*$/,"")});return"table"===n?(o=e.select(e.raw("'table' as type, tablename as name")).from("pg_tables").whereIn("schemaname",l),a&&(o=o.whereIn("tablename",a))):"index"===n?(o=e.select(e.raw("'index' as type, indexname as name")).from("pg_indexes").whereIn("schemaname",l),a&&(o=o.whereIn("indexname",a))):n||(o=e.select(e.raw("'table' as type, tablename as name")).from("pg_tables").whereIn("schemaname",l).union(function(){this.select(e.raw("'index' as type, indexname as name")).from("pg_indexes").whereIn("schemaname",l),a&&this.whereIn("indexname",a)}),a&&(o=o.whereIn("tablename",a))),o;case"sqlite3":return o=e.select(e.raw("type, name")).from("sqlite_master"),n&&(o=o.where("type",n)),a&&(o=o.whereIn("name",a)),o;default:return new t(function(e,n){n(i.unsupported_client(c))})}},l.createTables=function(e){return d(e).then(function(n){return c(e)?e.transaction(function(e){return t.all([n.fr.create(e),n.pa.create(e),n.da.create(e)]).then(e.commit)["catch"](e.rollback)}):o(e)?e.upgrade(function(){n.fr.create(e),n.pa.create(e),n.da.create(e)}):new t(function(e,n){n(i.database_error("ImyDBManager","createTables"))})})},l.createTablesIfNotExist=function(e){var n=this;return d(e).then(function(a){return n.checkObject(e,"table",[a.fr.name,a.pa.name,a.da.name]).then(function(n){return c(e)?e.transaction(function(e){return t.all([n[0]?0:a.fr.create(e),n[1]?0:a.pa.create(e),n[2]?0:a.da.create(e)]).then(e.commit)["catch"](e.rollback)}):o(e)?e.upgrade(function(){n[0]||a.fr.create(e),n[1]||a.pa.create(e),n[2]||a.da.create(e)})["catch"](e.rollback):new t(function(e,n){n(i.database_error("ImyDBManager","createTablesIfNotExist"))})})})},l.dropTables=function(e){return d(e).then(function(n){return c(e)?e.transaction(function(e){return t.all([n.fr.drop(e),n.pa.drop(e),n.da.drop(e)]).then(e.commit)["catch"](e.rollback)}):o(e)?e.upgrade(function(){n.fr.drop(e),n.pa.drop(e),n.da.drop(e)}):new t(function(e,n){n(i.database_error("ImyDBManager","dropTables"))})})},l.dropTablesIfExist=function(e){var n=this;return d(e).then(function(a){return n.checkObject(e,"table",[a.fr.name,a.pa.name,a.da.name]).then(function(n){return c(e)?e.transaction(function(e){return t.all([n[0]?a.fr.drop(e):0,n[1]?a.pa.drop(e):0,n[2]?a.da.drop(e):0]).then(e.commit)["catch"](e.rollback)}):o(e)?e.upgrade(function(){n[0]&&a.fr.drop(e),n[1]&&a.pa.drop(e),n[2]&&a.da.drop(e)})["catch"](e.rollback):new t(function(e,n){n(i.database_error("ImyDBManager","dropTablesIfExist"))})})})},l.createIndices=function(e){return d(e).then(function(n){return c(e)?e.transaction(function(e){var a=[],r=0,i=0;for(r=0,i=n.fr.index.length;r<i;r+=1)a[a.length]=n.fr.index[r].create(e);for(r=0,i=n.pa.index.length;r<i;r+=1)a[a.length]=n.pa.index[r].create(e);for(r=0,i=n.da.index.length;r<i;r+=1)a[a.length]=n.da.index[r].create(e);return t.all(a).then(e.commit)["catch"](e.rollback)}):o(e)?e.upgrade(function(){var t=0,a=0;for(t=0,a=n.fr.index.length;t<a;t+=1)n.fr.index[t].create(e);for(t=0,a=n.pa.index.length;t<a;t+=1)n.pa.index[t].create(e);for(t=0,a=n.da.index.length;t<a;t+=1)n.da.index[t].create(e)}):new t(function(e,n){n(i.database_error("ImyDBManager","createIndices"))})})},l.createIndicesIfNotExist=function(e){var n=this;return d(e).then(function(a){var r=[],d={},l=0,f=0;for(l=0,f=a.fr.index.length;l<f;l+=1)r[r.length]=a.fr.index[l].name,d[a.fr.index[l].name]=a.fr.index[l];for(l=0,f=a.pa.index.length;l<f;l+=1)r[r.length]=a.pa.index[l].name,d[a.pa.index[l].name]=a.pa.index[l];for(l=0,f=a.da.index.length;l<f;l+=1)r[r.length]=a.da.index[l].name,d[a.da.index[l].name]=a.da.index[l];return n.checkObject(e,"index",r).then(function(n){return c(e)?e.transaction(function(e){var a=[];for(l=0,f=n.length;l<f;l+=1){var i=r.indexOf(n[l].name);i!==-1&&r.splice(i,1)}for(l=0,f=r.length;l<f;l+=1)a[a.length]=d[r[l]].create(e);return t.all(a).then(e.commit)["catch"](e.rollback)}):o(e)?e.upgrade(function(){for(l=0,f=n.length;l<f;l+=1){var t=r.indexOf(n[l].name);t!==-1&&r.splice(t,1)}for(l=0,f=r.length;l<f;l+=1)d[r[l]].create(e)})["catch"](e.rollback):new t(function(e,n){n(i.database_error("ImyDBManager","createIndicesIfNotExist"))})})})},l.dropIndices=function(e){return d(e).then(function(n){return c(e)?e.transaction(function(e){var a=[],r=0,i=0;for(r=0,i=n.fr.index.length;r<i;r+=1)a[a.length]=n.fr.index[r].drop(e);for(r=0,i=n.pa.index.length;r<i;r+=1)a[a.length]=n.pa.index[r].drop(e);for(r=0,i=n.da.index.length;r<i;r+=1)a[a.length]=n.da.index[r].drop(e);return t.all(a).then(e.commit)["catch"](e.rollback)}):o(e)?e.upgrade(function(){var t=0,a=0;for(t=0,a=n.fr.index.length;t<a;t+=1)n.fr.index[t].drop(e);for(t=0,a=n.pa.index.length;t<a;t+=1)n.pa.index[t].drop(e);for(t=0,a=n.da.index.length;t<a;t+=1)n.da.index[t].drop(e)}):new t(function(e,n){n(i.database_error("ImyDBManager","dropIndices"))})})},l.dropIndicesIfExist=function(e){var n=this;return d(e).then(function(a){var r=[],d={},l=0,f=0;for(l=0,f=a.fr.index.length;l<f;l+=1)r[r.length]=a.fr.index[l].name,d[a.fr.index[l].name]=a.fr.index[l];for(l=0,f=a.pa.index.length;l<f;l+=1)r[r.length]=a.pa.index[l].name,d[a.pa.index[l].name]=a.pa.index[l];for(l=0,f=a.da.index.length;l<f;l+=1)r[r.length]=a.da.index[l].name,d[a.da.index[l].name]=a.da.index[l];return n.checkObject(e,"index",r).then(function(n){return c(e)?e.transaction(function(e){var a=[];for(l=0,f=n.length;l<f;l+=1){var r=n[l].name;d[r]&&(a[a.length]=d[r].drop(e))}return t.all(a).then(e.commit)["catch"](e.rollback)}):o(e)?e.upgrade(function(){for(l=0,f=n.length;l<f;l+=1){var t=n[l].name;d[t]&&d[t].drop(e)}})["catch"](e.rollback):new t(function(e,n){n(i.database_error("ImyDBManager","dropIndicesIfExist"))})})})},l.initialize=function(e){var n=this;return this.createTables(e).then(function(){return n.createIndices(e)})},e.ImyDBManager=l}((0,eval)("this").window||this);