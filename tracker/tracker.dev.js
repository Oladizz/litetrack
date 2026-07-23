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
(function () {
  'use strict';

  // If the user has DNT enabled, bail out immediately
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') {
    return;
  }

  // ─── Configuration ──────────────────────────────────────────────────────────
  var domain = '';
  var apiUrl = '';

  // 1. Try to read from window.op queue (OpenPanel style init)
  if (window.op && window.op.q) {
    var queue = window.op.q;
    for (var i = 0; i < queue.length; i++) {
      var args = queue[i];
      if (args[0] === 'init' && args[1]) {
        domain = args[1].clientId; // Use clientId as domain/siteId
        apiUrl = args[1].apiUrl || apiUrl;
        if (apiUrl && !apiUrl.endsWith('/event')) {
          apiUrl = apiUrl.replace(/\/$/, '') + '/event'; // Ensure it points to our /api/event
        }
      }
    }
  }

  // 2. Fallback to script tag attributes
  var scriptEl = document.currentScript;
  if (!domain) {
    domain = scriptEl && scriptEl.getAttribute('data-domain');
  }
  if (!apiUrl) {
    apiUrl = scriptEl && scriptEl.getAttribute('data-api');
    if (!apiUrl && scriptEl && scriptEl.src) {
      try {
        var srcUrl = new URL(scriptEl.src);
        apiUrl = srcUrl.origin + '/api/event';
      } catch (e) {}
    }
  }

  if (!domain || !apiUrl) {
    console.warn('[LiteTrack] Missing configuration. Use window.op("init", {...}) or data-attributes.');
    return;
  }

  // ─── Utility: Simple String Hash ─────────────────────────────────────
  function hash(str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) {
      h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
    }
    return h.toString(36);
  }

  // ─── Generate Daily Visitor ID ──────────────────────────────────────────────
  function getVisitorId() {
    var date = new Date().toISOString().slice(0, 10);
    var ua = navigator.userAgent || '';
    var lang = navigator.language || '';
    var screen = (window.screen.width || 0) + 'x' + (window.screen.height || 0);
    return hash(date + '|' + ua + '|' + lang + '|' + screen);
  }

  // ─── Extract UTM Parameters ──────────────────────────────────────────────────
  function getUtmParams() {
    var params = {};
    try {
      var sp = new URL(window.location.href).searchParams;
      ['source', 'medium', 'campaign', 'term', 'content'].forEach(function (key) {
        var val = sp.get('utm_' + key);
        if (val) params['utm_' + key] = val;
      });
    } catch (e) {}
    return params;
  }

  // ─── Event Queue and Batching ──────────────────────────────────────────────────
  var eventQueue = [];
  var flushInterval = 50000; // 50 seconds

  function flush() {
    if (eventQueue.length === 0) return;
    
    var payload = eventQueue.slice();
    eventQueue = []; // clear immediately
    
    var data = JSON.stringify(payload);
    var sent = false;

    if (navigator.sendBeacon) {
      try {
        sent = navigator.sendBeacon(apiUrl, new Blob([data], { type: 'application/json' }));
      } catch (e) {
        sent = false;
      }
    }

    if (!sent) {
      try {
        fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: data,
          keepalive: true,
        }).catch(function () {});
      } catch (e) {}
    }
  }

  // Flush on interval
  setInterval(flush, flushInterval);

  // Flush when tab is hidden or backgrounded (mobile Safari etc.)
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') flush();
  });

  // Flush when page is unloaded/closed
  window.addEventListener('pagehide', flush);

  // ─── Send Event Data ─────────────────────────────────────────────────────────
  function send(payload) {
    eventQueue.push(payload);
  }

  // ─── Build Event Payload ─────────────────────────────────────────────────────
  function buildPayload(type, eventName, props) {
    var payload = {
      type: type,
      domain: domain,
      pathname: window.location.pathname,
      hostname: window.location.hostname,
      referrer: document.referrer || null,
      screen_width: window.screen.width,
      visitor_id: getVisitorId(),
      timestamp: Date.now(),
    };

    var utm = getUtmParams();
    if (Object.keys(utm).length > 0) {
      payload.utm = utm;
    }

    if (type === 'event' && eventName) {
      payload.event_name = eventName;
    }
    if (props && typeof props === 'object') {
      payload.props = props;
    }

    return payload;
  }

  // ─── Track Pageview ──────────────────────────────────────────────────────────
  function trackPageview() {
    send(buildPayload('pageview'));
  }

  // ─── SPA Navigation Tracking ─────────────────────────────────────────────────
  var lastPathname = window.location.pathname;

  function handleNavigation() {
    if (window.location.pathname !== lastPathname) {
      lastPathname = window.location.pathname;
      trackPageview();
    }
  }

  var originalPushState = history.pushState;
  history.pushState = function () {
    originalPushState.apply(this, arguments);
    handleNavigation();
  };

  var originalReplaceState = history.replaceState;
  history.replaceState = function () {
    originalReplaceState.apply(this, arguments);
    handleNavigation();
  };

  window.addEventListener('popstate', handleNavigation);

  // ─── Process Queue and Expose API ────────────────────────────────────────────
  // Process any 'event' or 'track' calls that were queued before the script loaded
  if (window.op && window.op.q) {
    var queuedEvents = window.op.q;
    for (var j = 0; j < queuedEvents.length; j++) {
      var queuedArgs = queuedEvents[j];
      if (queuedArgs[0] === 'event' || queuedArgs[0] === 'track') {
        send(buildPayload('event', queuedArgs[1], queuedArgs[2]));
      }
    }
  }

  // Replace window.op proxy with the real function for immediate execution
  var trackerFunc = function () {
    var args = [].slice.call(arguments);
    if (args[0] === 'event' || args[0] === 'track') {
      send(buildPayload('event', args[1], args[2]));
    } else if (args[0] === 'pageview') {
      trackPageview();
    }
  };

  // ─── Auto Outbound Link Click Tracking ────────────────────────────────────
  document.addEventListener('click', function (e) {
    var target = e.target;
    while (target && target.tagName !== 'A') {
      target = target.parentElement;
    }
    if (target && target.href) {
      try {
        var url = new URL(target.href);
        if (url.hostname && url.hostname !== window.location.hostname && (url.protocol === 'http:' || url.protocol === 'https:')) {
          send(buildPayload('event', 'Link out', { link_url: target.href }));
        }
      } catch (err) {}
    }
  }, true);

  window.op = trackerFunc;
  window.litetrack = trackerFunc;

  // ─── Initial Pageview ────────────────────────────────────────────────────────
  trackPageview();
})();
