// Check if banner should be shown on page load
(async function () {
  const data = await chrome.storage.sync.get(["isOnBreak"]);
  if (data.isOnBreak) {
    createBanner();
  }
})();

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showBanner") {
    createBanner();
  } else if (request.action === "hideBanner") {
    removeBanner();
  }
});

function createBanner() {
  // Remove existing banner if any
  removeBanner();

  // Create banner element
  const banner = document.createElement("div");
  banner.id = "break-time-banner";

  banner.innerHTML = `
  <div class="banner-content">
    <div class="banner-icon">⏸️</div>

    <div class="banner-text">
      <div class="banner-title">Time for a Break!</div>
      <div class="banner-message">
        You've been working for 45 minutes. Take a 15-minute break.
      </div>
      <div class="banner-timer" id="banner-timer">15:00 remaining</div>

      </div>
      <button id="banner-reset-btn" class="banner-reset-btn">
        ▶ Resume Work
      </button>

    <div class="banner-tips">
      <strong>Break Tips:</strong> Stand up, stretch, drink water
    </div>
  </div>
`;

  document.body.appendChild(banner);
  const resetBtn = banner.querySelector("#banner-reset-btn");

  resetBtn.addEventListener("click", async () => {
    // Clear break state
    await chrome.storage.sync.set({
      isOnBreak: false,
      breakEndTime: null,
      workStartTime: Date.now(),
    });

    // Inform background (optional)
    chrome.runtime.sendMessage({ action: "resetTimer" });

    // Remove banner immediately
    removeBanner();
  });

  // Start timer update
  updateBannerTimer();
  const timerInterval = setInterval(updateBannerTimer, 1000);
  banner.dataset.timerInterval = timerInterval;
}

function removeBanner() {
  const banner = document.getElementById("break-time-banner");
  if (banner) {
    if (banner.dataset.timerInterval) {
      clearInterval(parseInt(banner.dataset.timerInterval));
    }
    banner.remove();
  }
}

async function updateBannerTimer() {
  const timerElement = document.getElementById("banner-timer");
  if (!timerElement) return;

  const data = await chrome.storage.sync.get(["breakEndTime"]);
  const remaining = data.breakEndTime - Date.now();

  if (remaining <= 0) {
    timerElement.textContent = "Break ending...";
    return;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")} remaining`;
}
