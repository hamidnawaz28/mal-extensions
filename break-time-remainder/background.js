const WORK_TIME = 1 * 60 * 1000; // 45 minutes in milliseconds

const BREAK_TIME = 1 * 60 * 1000; // 15 minutes in milliseconds

let startTime = null;
let isOnBreak = false;
let breakEndTime = null;

// Initialize on extension install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    startTime: Date.now(),
    isOnBreak: false,
    breakEndTime: null,
  });
  startTracking();
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      // avoid chrome:// and extension pages
      if (tab.id && tab.url && !tab.url.startsWith("chrome://")) {
        chrome.tabs.reload(tab.id);
      }
    });
  });
});

// Start tracking when service worker starts
chrome.runtime.onStartup.addListener(() => {
  loadStateAndTrack();
});

// Load state from storage and continue tracking
async function loadStateAndTrack() {
  const data = await chrome.storage.sync.get([
    "startTime",
    "isOnBreak",
    "breakEndTime",
  ]);

  startTime = data.startTime || Date.now();
  isOnBreak = data.isOnBreak || false;
  breakEndTime = data.breakEndTime || null;

  if (isOnBreak) {
    checkBreakStatus();
  } else {
    startTracking();
  }
}

// Start tracking work time
function startTracking() {
  chrome.alarms.create("checkWorkTime", { periodInMinutes: 1 });
}

// Listen for alarm to check work time
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkWorkTime") {
    checkWorkTime();
  } else if (alarm.name === "checkBreakTime") {
    checkBreakStatus();
  }
});

// Check if work time has exceeded 45 minutes
async function checkWorkTime() {
  const data = await chrome.storage.sync.get(["startTime", "isOnBreak"]);

  if (data.isOnBreak) return;

  const elapsed = Date.now() - data.startTime;

  if (elapsed >= WORK_TIME) {
    startBreak();
  }
}

// Start break period
async function startBreak() {
  isOnBreak = true;
  breakEndTime = Date.now() + BREAK_TIME;

  await chrome.storage.sync.set({
    isOnBreak: true,
    breakEndTime: breakEndTime,
  });

  // Show banner on all existing tabs
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (
      tab.url
      // !tab.url.startsWith("chrome://") &&
      // !tab.url.startsWith("chrome-extension")
    ) {
      chrome.tabs.sendMessage(tab.id, { action: "showBanner" }).catch(() => {});
    }
  }

  // Clear work time alarm and start break alarm
  chrome.alarms.clear("checkWorkTime");
  chrome.alarms.create("checkBreakTime", { periodInMinutes: 1 });

  // Block new tabs during break
  chrome.tabs.onCreated.addListener(blockNewTabs);
}

// Block new tabs during break period
async function blockNewTabs(tab) {
  const data = await chrome.storage.sync.get(["isOnBreak"]);

  if (data.isOnBreak) {
    // Close the new tab
    chrome.tabs.remove(tab.id);
  }
}

// Check if break time is over
async function checkBreakStatus() {
  const data = await chrome.storage.sync.get(["isOnBreak", "breakEndTime"]);

  if (!data.isOnBreak) return;

  if (Date.now() >= data.breakEndTime) {
    endBreak();
  }
}

// End break period and restart tracking
async function endBreak() {
  isOnBreak = false;
  startTime = Date.now();

  await chrome.storage.sync.set({
    startTime: startTime,
    isOnBreak: false,
    breakEndTime: null,
  });

  // Remove break listener
  chrome.tabs.onCreated.removeListener(blockNewTabs);

  // Hide banner on all tabs
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (
      tab.url &&
      !tab.url.startsWith("chrome://") &&
      !tab.url.startsWith("chrome-extension://")
    ) {
      chrome.tabs.sendMessage(tab.id, { action: "hideBanner" }).catch(() => {});
    }
  }

  // Restart work time tracking
  chrome.alarms.clear("checkBreakTime");
  startTracking();
}

// Listen for reset request from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "resetTimer") {
    resetTimer();
    sendResponse({ success: true });
  }
});

// Reset timer function
async function resetTimer() {
  // End break if currently on break
  if (isOnBreak) {
    await endBreak();
  }

  // Reset start time
  await chrome.storage.sync.set({
    startTime: Date.now(),
    isOnBreak: false,
    breakEndTime: null,
  });

  // Restart tracking
  chrome.alarms.clear("checkWorkTime");
  chrome.alarms.clear("checkBreakTime");
  startTracking();
}

// Initialize on service worker start
loadStateAndTrack();
