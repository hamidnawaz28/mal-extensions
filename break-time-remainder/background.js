const DEFAULT_WORK_MIN = 1;
const DEFAULT_BREAK_MIN = 1;

// Install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    workDurationMs: DEFAULT_WORK_MIN * 60000,
    breakDurationMs: DEFAULT_BREAK_MIN * 60000,
    startTime: null,
    isRunning: false,
    isOnBreak: false,
    breakEndTime: null,
  });
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      // avoid chrome:// and extension pages
      if (tab.id && tab.url && !tab.url.startsWith("chrome://")) {
        chrome.tabs.reload(tab.id);
      }
    });
  });
});

// Startup
chrome.runtime.onStartup.addListener(loadStateAndTrack);
loadStateAndTrack();

async function loadStateAndTrack() {
  const data = await chrome.storage.sync.get([
    "isRunning",
    "isOnBreak",
    "breakEndTime",
  ]);

  if (!data.isRunning) return;

  if (data.isOnBreak) {
    chrome.alarms.create("checkBreakTime", { periodInMinutes: 1 });
    checkBreakStatus();
  } else {
    startTracking();
  }
}

function startTracking() {
  chrome.alarms.create("checkWorkTime", { periodInMinutes: 1 });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkWorkTime") checkWorkTime();
  if (alarm.name === "checkBreakTime") checkBreakStatus();
});

async function checkWorkTime() {
  const data = await chrome.storage.sync.get([
    "startTime",
    "workDurationMs",
    "isRunning",
    "isOnBreak",
  ]);

  if (!data.isRunning || data.isOnBreak) return;

  if (Date.now() - data.startTime >= data.workDurationMs) {
    startBreak();
  }
}

async function startBreak() {
  const { breakDurationMs } = await chrome.storage.sync.get("breakDurationMs");
  const breakEndTime = Date.now() + breakDurationMs;

  await chrome.storage.sync.set({
    isOnBreak: true,
    breakEndTime,
  });

  chrome.alarms.clear("checkWorkTime");
  chrome.alarms.create("checkBreakTime", { periodInMinutes: 1 });
  chrome.tabs.onCreated.addListener(blockNewTabs);

  const tabs = await chrome.tabs.query({});
  tabs.forEach((tab) => {
    if (tab.id && tab.url?.startsWith("http")) {
      chrome.tabs.sendMessage(tab.id, { action: "showBanner" }).catch(() => {});
    }
  });
}

async function blockNewTabs(tab) {
  const { isOnBreak } = await chrome.storage.sync.get("isOnBreak");
  if (isOnBreak) chrome.tabs.remove(tab.id);
}

async function checkBreakStatus() {
  const { isOnBreak, breakEndTime } = await chrome.storage.sync.get([
    "isOnBreak",
    "breakEndTime",
  ]);

  if (!isOnBreak) return;
  if (Date.now() >= breakEndTime) endBreak();
}

async function endBreak() {
  await chrome.storage.sync.set({
    isOnBreak: false,
    breakEndTime: null,
    startTime: Date.now(),
  });

  chrome.alarms.clear("checkBreakTime");
  chrome.tabs.onCreated.removeListener(blockNewTabs);
  startTracking();

  const tabs = await chrome.tabs.query({});
  tabs.forEach((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: "hideBanner" }).catch(() => {});
  });
}

// Messages
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.action === "startTimer") startTimer();
  if (req.action === "stopTimer") stopTimer();
  if (req.action === "resetTimer") resetTimer();
});

async function startTimer() {
  await chrome.storage.sync.set({
    startTime: Date.now(),
    isRunning: true,
    isOnBreak: false,
    breakEndTime: null,
  });
  startTracking();
}

async function stopTimer() {
  chrome.alarms.clearAll();
  chrome.tabs.onCreated.removeListener(blockNewTabs);

  await chrome.storage.sync.set({
    isRunning: false,
    isOnBreak: false,
    breakEndTime: null,
  });

  const tabs = await chrome.tabs.query({});
  tabs.forEach((tab) => {
    chrome.tabs.sendMessage(tab.id, { action: "hideBanner" }).catch(() => {});
  });
}

async function resetTimer() {
  chrome.alarms.clearAll();
  chrome.tabs.onCreated.removeListener(blockNewTabs);

  await chrome.storage.sync.set({
    startTime: Date.now(),
    isRunning: true,
    isOnBreak: false,
    breakEndTime: null,
  });

  // 🔑 Force-hide banner everywhere
  const tabs = await chrome.tabs.query({});
  tabs.forEach((tab) => {
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, { action: "hideBanner" }).catch(() => {});
    }
  });

  startTracking();
}
