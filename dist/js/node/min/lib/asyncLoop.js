!function(n){"use strict";var t=require("./SyncPromise.js").SyncPromise,r=function(n,r){for(var i=[],c=0,e=n.length;c<e;c+=1)i[c]=n[c];return new t(function(n,t){var c=function e(){try{if(i.length>0){var c=i.shift();r(c,function(){e()})}else n()}catch(o){t(o)}};c()})};n.asyncLoop=r}(this);