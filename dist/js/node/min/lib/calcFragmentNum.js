!function(r){"use strict";var n=function(r){return!("number"!=typeof r&&!/^_d+$/.test(r)&&null!==r&&void 0!==r)},t=function(r,t){var i=0|r,e=0|t,u=0;if(!n(r)||i<=0)throw new Error("invalid argument: skip");if(!n(t)||e<=1)throw new Error("invalid argument: len");if(u=e*(e-1),t>r){var a=e-i;u-=a*(a-1)}return u/2};r.calcFragmentNum=t}(this);