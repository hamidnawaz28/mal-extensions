const REFRESH_INTERVAL_MS = 2000;
const CHECK_DELAY_MS = 1000;

let isRunning = false;

function log(msg) {
  console.log(`[Ride Checker] ${msg}`);
}

function clickRefresh() {
  const refreshButton = document.querySelector(
    "button.clear-or-refresh-link ion-icon[name='refresh']"
  ).parentElement;
  if (refreshButton) {
    refreshButton.click();
    log("Clicked refresh button");
  } else {
    log("❌ Refresh button not found");
  }
}

function checkAndAcceptRide() {
  const RIDE_AVAILABLE_SELECTOR = ".ride-card.available";
  const ACCEPT_BUTTON_SELECTOR = ".accept-btn";
  const ride = document.querySelector(RIDE_AVAILABLE_SELECTOR);
  if (ride) {
    const acceptBtn = ride.querySelector(ACCEPT_BUTTON_SELECTOR);
    if (acceptBtn) {
      acceptBtn.click();
      log("✅ Ride found and accepted!");
    } else {
      log("⚠️ Ride available but accept button not found");
    }
  } else {
    log("No rides available yet");
  }
}

async function startRideChecker() {
  if (isRunning) {
    log("Already running");
    return;
  }

  isRunning = true;
  log("Started checking for rides...");

  while (isRunning) {
    clickRefresh();
    await new Promise((r) => setTimeout(r, CHECK_DELAY_MS));
    checkAndAcceptRide();
    await new Promise((r) => setTimeout(r, REFRESH_INTERVAL_MS));
  }
}

// Stop the loop if needed
function stopRideChecker() {
  isRunning = false;
  log("Stopped checking for rides");
}

// Optional: Add keyboard shortcuts to start/stop
document.addEventListener("keydown", (e) => {
  if (e.key === "s") startRideChecker();
  if (e.key === "x") stopRideChecker();
});
