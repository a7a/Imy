!function(r){"use strict";var t=require("./arrayAddSuffix.js").arrayAddSuffix,e=function(r,e){var n=[],i=[],o=+(e&&void 0!==e.start?e.start:0),s=+(e&&void 0!==e.skip?e.skip:1),a=e&&void 0!==e.omit?e.omit:[],g=e&&"function"==typeof e.weiting_function?e.weiting_function:null;if("string"!=typeof r&&!(r instanceof String))throw new Error("argument error: arguments[0] must be string");if(o<0||~(o+"").indexOf("."))throw new Error("argument error: arguments[1] opt.start must be integer over 0");if(s<1||~(s+"").indexOf("."))throw new Error("argument error: arguments[1] opt.skip must be integer over 1");if(!Array.isArray(a))throw new Error("argument error: arguments[1] opt.omit must be Array");i=t(r.split(""),{omit:a});for(var f=1;f<=s;f+=1){var u=n.length,m=[],p=[];n[u]={skip:f,weight:null,frags:[],sort_flags:[]},g&&(n[u].weight=g(f));for(var h=0,l=i.length;h<l-f;h+=1)i[h][0]<i[h+f][0]||i[h][0]===i[h+f][0]&&i[h][1]<i[h+f][1]?(m[m.length]=[{pos:i[h][1]+o,frag:i[h][0]},{pos:i[h+f][1]+o,frag:i[h+f][0]}],p[p.length]=0):(m[m.length]=[{pos:i[h][1]+o,frag:i[h+f][0]},{pos:i[h+f][1]+o,frag:i[h][0]}],p[p.length]=1);n[u].frags=m,n[u].sort_flags=p}return n};r.stringToFragments=e}(this);