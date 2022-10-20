
var mobile = 768;
var tablet = 1280;
//var desktop = 1440;

/**
 * Easily check if a breakpoint is active via JavaScript
 *
 * 
 * @returns {string}
 */
export let getBreakpoint = function () {
    var bp
    if (window.innerWidth <= mobile) bp = "mobile"
    else if (window.innerWidth > mobile && window.innerWidth <= tablet) bp = "tablet"
    else if (window.innerWidth > tablet) bp="desktop"
    else bp="unknown"
   
    return bp;
};
