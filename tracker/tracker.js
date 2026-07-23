/**
 * LiteTrack — Privacy-First Analytics Tracker (Development Version)
 * 
 * Features:
 * - NO cookies, NO localStorage, NO fingerprinting
 * - Auto-tracks pageviews on page load and SPA navigation (pushState/popState)
 * - Custom events via: window.op('event', 'purchase', {revenue: 29.99})
 * - Sends data via navigator.sendBeacon (fallback to fetch POST)
 * - Captures: pathname, hostname, referrer, screen width, UTM params
 * - Generates a daily privacy-safe visitor ID (date + UA + language + screen hash)
 * - Respects Do Not Track (DNT) header
 * - Supports OpenPanel style init script and queue
 * 
 * @version 1.1.0
 * @license MIT
 */
!function(){"use strict";if("1"!==navigator.doNotTrack&&"1"!==window.doNotTrack){var t="",e="";if(window.op&&window.op.q)for(var n=window.op.q,i=0;i<n.length;i++){var a=n[i];"init"===a[0]&&a[1]&&(t=a[1].clientId,(e=a[1].apiUrl||e)&&!e.endsWith("/event")&&(e=e.replace(/\/$/,"")+"/event"))}var o=document.currentScript;if(t||(t=o&&o.getAttribute("data-domain")),!e&&!(e=o&&o.getAttribute("data-api"))&&o&&o.src)try{var r=new URL(o.src);e=r.origin+"/api/event"}catch(t){}if(t&&e){var c=[];setInterval(l,5e4),document.addEventListener("visibilitychange",function(){"hidden"===document.visibilityState&&l()}),window.addEventListener("pagehide",l);var d=window.location.pathname,w=history.pushState;history.pushState=function(){w.apply(this,arguments),y()};var s=history.replaceState;if(history.replaceState=function(){s.apply(this,arguments),y()},window.addEventListener("popstate",y),window.op&&window.op.q)for(var p=window.op.q,v=0;v<p.length;v++){var h=p[v];"event"!==h[0]&&"track"!==h[0]||f(g("event",h[1],h[2]))}var u=function(){var t=[].slice.call(arguments);"event"===t[0]||"track"===t[0]?f(g("event",t[1],t[2])):"pageview"===t[0]&&m()};window.op=u,window.litetrack=u,m()}else console.warn('[LiteTrack] Missing configuration. Use window.op("init", {...}) or data-attributes.')}function l(){if(0!==c.length){var t=c.slice();c=[];var n=JSON.stringify(t),i=!1;if(navigator.sendBeacon)try{i=navigator.sendBeacon(e,new Blob([n],{type:"application/json"}))}catch(t){i=!1}if(!i)try{fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:n,keepalive:!0}).catch(function(){})}catch(t){}}}function f(t){c.push(t)}function g(e,n,i){var a={type:e,domain:t,pathname:window.location.pathname,hostname:window.location.hostname,referrer:document.referrer||null,screen_width:window.screen.width,visitor_id:function(t){for(var e=5381,n=0;n<t.length;n++)e=(e<<5)+e+t.charCodeAt(n)>>>0;return e.toString(36)}((new Date).toISOString().slice(0,10)+"|"+(navigator.userAgent||"")+"|"+(navigator.language||"")+"|"+(window.screen.width||0)+"x"+(window.screen.height||0)),timestamp:Date.now()},o=function(){var t={};try{var e=new URL(window.location.href).searchParams;["source","medium","campaign","term","content"].forEach(function(n){var i=e.get("utm_"+n);i&&(t["utm_"+n]=i)})}catch(t){}return t}();return Object.keys(o).length>0&&(a.utm=o),"event"===e&&n&&(a.event_name=n),i&&"object"==typeof i&&(a.props=i),a}function m(){f(g("pageview"))}function y(){window.location.pathname!==d&&(d=window.location.pathname,m())}}();