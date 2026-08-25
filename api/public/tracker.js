(function () {
  "use strict";

  const dnt = navigator.doNotTrack || window.doNotTrack;
  if (dnt === "1") return;

  let domain = "";
  let apiUrl = "";
  const queue = window.op?.q || [];

  for (const cmd of queue) {
    if (cmd[0] === "init" && cmd[1]) {
      domain = cmd[1].clientId;
      apiUrl = cmd[1].apiUrl || apiUrl;
    }
  }

  const script = document.currentScript;
  if (!domain && script) domain = script.getAttribute("data-domain");
  if (!apiUrl && script) apiUrl = script.getAttribute("data-api");
  
  if (!apiUrl) {
    apiUrl = "https://litetrack-ingest-http-916484331446.us-central1.run.app/ingestEvent";
  }

  if (!domain || !apiUrl) {
    console.warn('[LiteTrack] Missing configuration.');
    return;
  }

  let eventsQueue = [];
  
  function flush() {
    if (eventsQueue.length === 0) return;
    const batch = eventsQueue.slice();
    eventsQueue = [];
    const payload = JSON.stringify(batch);

    let sent = false;
    if (navigator.sendBeacon) {
      try { sent = navigator.sendBeacon(apiUrl, new Blob([payload], { type: "application/json" })); } catch (e) { sent = false; }
    }
    if (!sent) {
      try { fetch(apiUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(()=>{}); } catch (e) {}
    }
  }

  setInterval(flush, 5000);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });
  window.addEventListener("pagehide", flush);

  let currentPath = window.location.pathname;

  function trackEvent(eventName, props = {}) {
    eventsQueue.push(buildEvent("event", eventName, props));
  }

  function getUtm() {
    const utm = {};
    try {
      const params = new URL(window.location.href).searchParams;
      ["source", "medium", "campaign", "term", "content"].forEach((p) => {
        const val = params.get("utm_" + p);
        if (val) utm["utm_" + p] = val;
      });
    } catch (e) {}
    return utm;
  }

  function buildEvent(type, eventName, props = {}) {
    const e = {
      type,
      domain,
      pathname: window.location.pathname,
      hostname: window.location.hostname,
      referrer: document.referrer || null,
      screen_size: window.screen.width + "x" + window.screen.height,
      timestamp: new Date().toISOString()
    };
    
    const utm = getUtm();
    if (Object.keys(utm).length > 0) Object.assign(e, utm);
    if (type === "event" && eventName) e.event_name = eventName;
    if (props && typeof props === "object") {
      Object.assign(e, props);
    }
    return e;
  }

  function analyzeSeo() {
    let score = 100;
    const issues = [];
    
    if (!document.title || document.title.length < 10) { score -= 20; issues.push("Title is missing or too short"); }
    if (!document.querySelector('meta[name="description"]')) { score -= 20; issues.push("Missing meta description"); }
    if (!document.querySelector('h1')) { score -= 15; issues.push("Missing H1 tag"); }
    
    const images = document.querySelectorAll('img');
    let missingAlt = 0;
    images.forEach(img => { if (!img.hasAttribute('alt')) missingAlt++; });
    if (missingAlt > 0) {
      score -= Math.min(20, missingAlt * 5);
      issues.push(missingAlt + " image(s) missing alt text");
    }
    
    return { score: Math.max(0, score), issues };
  }

  function trackPerformanceAndPageview() {
    const perfData = {};
    
    if (window.performance && window.performance.getEntriesByType) {
      const navEntry = window.performance.getEntriesByType("navigation")[0];
      if (navEntry) perfData.ttfb = navEntry.responseStart - navEntry.requestStart;
    }
    
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') perfData.fcp = entry.startTime;
        }
      }).observe({ type: 'paint', buffered: true });
    } catch(e) {}
    
    setTimeout(() => {
      const seo = analyzeSeo();
      const payload = buildEvent("pageview", null, {
        ttfb: perfData.ttfb,
        fcp: perfData.fcp,
        seo_score: seo.score,
        seo_issues: seo.issues
      });
      eventsQueue.push(payload);
      flush();
    }, 2500); 
  }

  const pushState = history.pushState;
  history.pushState = function () { pushState.apply(this, arguments); onNavigate(); };
  const replaceState = history.replaceState;
  history.replaceState = function () { replaceState.apply(this, arguments); onNavigate(); };
  window.addEventListener("popstate", onNavigate);

  function onNavigate() {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      trackPerformanceAndPageview();
    }
  }

  window.op = window.litetrack = function () {
    const args = [].slice.call(arguments);
    if (args[0] === "event" || args[0] === "track") trackEvent(args[1], args[2]);
    else if (args[0] === "pageview") trackPerformanceAndPageview();
  };

  trackPerformanceAndPageview();
})();
