/*

* matchMedia() polyfill - test whether a CSS media type or media query applies
* authors: Scott Jehl, Paul Irish, Nicholas Zakas
* Copyright (c) 2011 Scott, Paul and Nicholas.
* Dual MIT/BSD license
*/
window.matchMedia = window.matchMedia || (function(doc, undefined){
  
  var bool,
      docElem  = doc.documentElement,
      refNode  = docElem.firstElementChild || docElem.firstChild,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody = doc.createElement('body'),
      div      = doc.createElement('div');
  
  div.id = 'mq-test-1';
  div.style.cssText = "position:absolute;top:-100em";
  fakeBody.appendChild(div);
  
  return function(q){
    
    div.innerHTML = '&shy;<style media="'+q+'"> #mq-test-1 { width: 42px; }</style>';
    
    docElem.insertBefore(fakeBody, refNode);
    bool = div.offsetWidth == 42;  
    docElem.removeChild(fakeBody);
    
    return { matches: bool, media: q };
  };
  
})(document);

/*
* MediaQueryListener proof of concept using CSS transitions.
* November 5th 2011
*
* Based on the excellent matchMedia polyfill
* https://github.com/paulirish/matchMedia.js
*
* Authors: Paul Hayes, David Somers
*
*/
mql = (function(doc, undefined) {
  
  // If we have native support for listening to events, use it.
  if (typeof(window.MediaQueryList) !== "undefined") {
    return function(q, cb) {
      var m = window.matchMedia(q);
      m.addListener(cb);
    }
  }

  var docElem = doc.documentElement,
      refNode = docElem.firstElementChild || docElem.firstChild,
      idCounter = 0;

  if(!doc.getElementById('mq-style')) {
    style = doc.createElement('style');
    style.id = 'mq-style';
    style.textContent = '.mq { -webkit-transition: width 0.001ms; -moz-transition: width 0.001ms; -o-transition: width 0.001ms; -ms-transition: width 0.001ms; width: 0; position: absolute; top: -100em; }\n';
    docElem.insertBefore(style, refNode);          
  }

  var transitionEnds = Array('transitionend','webkitTransitionEnd','oTransitionEnd','msTransitionEnd');

  for(var i in transitionEnds) { 
    if ('on'+ transitionEnds[i].toLowerCase() in window)  transitionEnd = transitionEnds[i];
  }  

  return function(q, cb) {
    var id = 'mql-' + idCounter++,
        callback = function() {
            // perform test and send results to callback
            cb({
                matches: (div.offsetWidth == 42),
                media: q
            });
        },
        div = doc.createElement('div');

    div.className = 'mq'; // mq class in CSS declares width: 0 and transition on width of duration 0.001ms
    div.id = id;
    style.textContent += '@media ' + q + ' { #' + div.id + ' { width: 42px; } }\n';        

    // add transition event listener
    div.addEventListener(transitionEnd, callback, false); 

    docElem.insertBefore(div, refNode);

    // original polyfill removes element, we need to keep element for transitions to continue and events to fire.
    return {
        matches: div.offsetWidth == 42,
        media: q
    };
  };

})(document);
