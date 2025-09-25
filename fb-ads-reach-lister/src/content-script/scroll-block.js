 function  blockScrollEvent() {
  if (!window.__origAddEvent) {
    window.__origAddEvent = EventTarget.prototype.addEventListener;
  }

  window.onscroll = null;
  document.onscroll = null;

  EventTarget.prototype.addEventListener = function (type, listener, options) {
    if (type === "scroll") {
      console.log("[Blocked scroll listener]", this);
      return;
    }
    return window.__origAddEvent.call(this, type, listener, options);
  };

  window.__scrollBlocker = (e) => e.stopImmediatePropagation();
  document.addEventListener("scroll", window.__scrollBlocker, true);

  console.log("🚫 Scroll events disabled");
};


function restoreScroll() {
  if (window.__origAddEvent) {
    EventTarget.prototype.addEventListener = window.__origAddEvent;
    delete window.__origAddEvent;
  }
  if (window.__scrollBlocker) {
    document.removeEventListener("scroll", window.__scrollBlocker, true);
    delete window.__scrollBlocker;
  }
  console.log("✅ Scroll events restored");
}

export { blockScrollEvent, restoreScroll }