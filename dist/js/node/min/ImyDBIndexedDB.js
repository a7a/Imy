!function(t,e){"use strict";var n=require("./lib/ImyDBBase.js").ImyDBBase,r=e.SLI2||require("sli2").SLI2||e.SLI2,a=require("./param/ImyDBSLI2.param.js").ImyDBSLI2,o=require("./lib/util.js").util,i=require("./param/ERROR.js").ERROR,u=function(t){n.call(this,t),this.tables=["imy_idx_fragments","imy_idx_parameters","imy_data"]};u._name_="ImyDBIndexedDB",u.prototype=Object.create(n.prototype,{constructor:{value:u,enumerable:!0,writable:!1,configurable:!0}}),u.prototype.open=function(){return this.db.open()},u.prototype.close=function(){return this.db.close()},u.prototype.useConfig=function(t){this.db=new r(t)},u.prototype.transaction=function(t){var e=this;return this.db.beginTransaction(this.tables,r.READ_WRITE,function(){e.trx=e.db,t()}).then(function(){e.trx=null})["catch"](function(){e.trx=null})},u.prototype.commit=function(){null!==this.trx||i.no_transaction("commit")},u.prototype.rollback=function(){null!==this.trx?this.trx.rollback():i.no_transaction("rollback")},u.prototype.getAllIndexFragments=function(){var t=a.fr.select.all(this._getInstance());return this._doDebugging({name:"getAllIndexFragments",query:t}),t},u.prototype.getIndexFragmentIdForTypeAndValue=function(t,e){var n=a.fr.select["id.for_type_value"](this._getInstance(),{type:o._string(t),value:o._string(e)});return this._doDebugging({name:"getIndexFragmentIdForTypeAndValue",query:n}),n.then(function(t){return t[0]?t[0].id:null})},u.prototype.addIndexFragment=function(t,e){var n=a.fr.insert(this._getInstance(),{type:o._string(t),value:o._string(e)});return this._doDebugging({name:"addIndexFragment",query:n}),n},u.prototype.removeIndexFragments=function(t,e){var n=a.fr["delete"].for_type_value(this._getInstance(),{type:o._string(t),value:o._string(e)});return this._doDebugging({name:"removeIndexFragments",query:n}),n},u.prototype.truncateIndexFragments=function(){var t=a.fr["delete"].all(this._getInstance());return this._doDebugging({name:"truncateIndexFragments",query:t}),t},u.prototype.getAllIndexParameters=function(){var t=a.pa.select.all(this._getInstance());return this._doDebugging({name:"getAllIndexParameters",query:t}),t},u.prototype.addIndexParameter=function(t,e,n,r,i,u,s){var g=a.pa.insert(this._getInstance(),{type:o._string(t),idx_fragment_id:o._double(e),data_id:o._double(n),content_pos1:o._int(r),content_pos2:o._int(i),sort_flag:o._int(u),skip:o._int(s)});return this._doDebugging({name:"addIndexParameter",query:g}),g},u.prototype.removeIndexParameters=function(t){var e=a.pa["delete"].for_dataid(this._getInstance(),{data_id:o._double(t)});return this._doDebugging({name:"removeIndexParameter",query:e}),e},u.prototype.countIndexParametersOfFragment=function(t,e){var n=a.count["parametered_fragment.for_type_value"](this._getInstance(),{type:o._string(t),value:o._string(e)});return this._doDebugging({name:"countIndexParametersOfFragment",query:n}),n.then(function(t){return t[0]?t[0][Object.keys(t[0])[0]]:0})},u.prototype.truncateIndexParameters=function(){var t=a.pa["delete"].all(this._getInstance());return this._doDebugging({name:"truncateIndexParameters",query:t}),t},u.prototype.getAllData=function(){var t=a.da.select["all.for"](this._getInstance());return this._doDebugging({name:"getAllData",query:t}),t},u.prototype.getDataForTypeAndContent=function(t,e){var n=a.da.select["all.for"](this._getInstance(),{type:o._string(t),content:o._string(e)});return this._doDebugging({name:"getDataForTypeAndContent",query:n}),n},u.prototype.getDatumForId=function(t){var e=a.da.select["all.for"](this._getInstance(),{id:o._double(t)});return this._doDebugging({name:"getDatumForId",query:e}),e},u.prototype.addDatum=function(t,e){var n=a.da.insert(this._getInstance(),{type:o._string(t),content:o._string(e)});return this._doDebugging({name:"addDatum",query:n}),n},u.prototype.removeData=function(t){var e=a.da["delete"]["for"](this._getInstance(),{id:o._double(t)});return this._doDebugging({name:"removeData",query:e}),e},u.prototype.updateData=function(t,e){var n=a.da.update["for"](this._getInstance(),{type:o._string(t.type),content:o._string(t.content)},{id:o._double(e.id),type:o._double(e.type),content:o._double(e.type)});return this._doDebugging({name:"updateData",query:n}),n},u.prototype.truncateData=function(){var t=a.da["delete"].all(this._getInstance());return this._doDebugging({name:"truncateData",query:t}),t},u.prototype.getForTypeAndValues=function(t,e){var n=a.search["parametered_fragment.for_type_values"](this._getInstance(),{type:o._string(t),values:e});return this._doDebugging({name:"getForTypeAndValues",query:n}),n},t.ImyDBIndexedDB=u,e.ImyDBIndexedDB=u}(this,(0,eval)("this"));