let mode = "fixed";
let timeUnit = "seconds";
let isActive = false;
let intervalId = null;
let countdown = 0;
let nextRefresh = 0;
let tabId = null;

// Settings
let settings = {
  autoStart: false,
  notifications: true,
  sound: false,
};

// Load settings from storage
chrome.storage.local.get(["settings"], (result) => {
  if (result.settings) {
    settings = result.settings;
    updateSettingsUI();
  }
});

// Get current tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  tabId = tabs[0].id;

  // Check if auto-refresh is already active for this tab
  chrome.storage.local.get([`active_${tabId}`], (result) => {
    if (result[`active_${tabId}`]) {
      const data = result[`active_${tabId}`];
      mode = data.mode;
      timeUnit = data.timeUnit;
      isActive = true;

      // Restore UI state
      document.querySelectorAll(".mode-btn").forEach((btn) => {
        btn.classList.remove("active", "fixed", "random");
        if (btn.dataset.mode === mode) {
          btn.classList.add("active", mode);
        }
      });

      document.querySelectorAll(".time-btn").forEach((btn) => {
        btn.classList.remove("active");
        if (btn.dataset.unit === timeUnit) {
          btn.classList.add("active");
        }
      });

      if (mode === "fixed") {
        document.getElementById("fixedValue").value = data.value;
      } else {
        document.getElementById("minValue").value = data.min;
        document.getElementById("maxValue").value = data.max;
      }

      updateModeDisplay();
      updateUI();
      startRefresh();
    }
  });
});

// Mode buttons
document.querySelectorAll(".mode-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".mode-btn")
      .forEach((b) => b.classList.remove("active", "fixed", "random"));
    btn.classList.add("active");
    mode = btn.dataset.mode;
    btn.classList.add(mode);
    updateModeDisplay();
  });
});

// Time unit buttons
document.querySelectorAll(".time-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".time-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    timeUnit = btn.dataset.unit;
    document.getElementById("fixedUnit").textContent = timeUnit;
    document.getElementById("randomUnit").textContent = timeUnit;
  });
});

// Settings modal functions
function openSettings() {
  document.getElementById("settingsModal").classList.remove("hidden");
}

function closeSettings() {
  document.getElementById("settingsModal").classList.add("hidden");
}

// Settings modal event listeners
document.getElementById("settingsBtn").addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  openSettings();
});

document.getElementById("closeModal").addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  closeSettings();
});

document.getElementById("doneBtn").addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  closeSettings();
});

// Close modal when clicking on overlay (outside modal content)
document.getElementById("settingsModal").addEventListener("click", (e) => {
  if (e.target.id === "settingsModal") {
    closeSettings();
  }
});

// Prevent modal content clicks from closing modal
document.querySelector(".modal-content").addEventListener("click", (e) => {
  e.stopPropagation();
});

// Settings toggles
document
  .getElementById("autoStartToggle")
  .addEventListener("click", function (e) {
    e.stopPropagation();
    this.classList.toggle("active");
    settings.autoStart = this.classList.contains("active");
    saveSettings();
  });

document
  .getElementById("notificationsToggle")
  .addEventListener("click", function (e) {
    e.stopPropagation();
    this.classList.toggle("active");
    settings.notifications = this.classList.contains("active");
    saveSettings();
  });

document.getElementById("soundToggle").addEventListener("click", function (e) {
  e.stopPropagation();
  this.classList.toggle("active");
  settings.sound = this.classList.contains("active");
  saveSettings();
});

function updateSettingsUI() {
  const autoStartToggle = document.getElementById("autoStartToggle");
  const notificationsToggle = document.getElementById("notificationsToggle");
  const soundToggle = document.getElementById("soundToggle");

  if (settings.autoStart) {
    autoStartToggle.classList.add("active");
  } else {
    autoStartToggle.classList.remove("active");
  }

  if (settings.notifications) {
    notificationsToggle.classList.add("active");
  } else {
    notificationsToggle.classList.remove("active");
  }

  if (settings.sound) {
    soundToggle.classList.add("active");
  } else {
    soundToggle.classList.remove("active");
  }
}

function saveSettings() {
  chrome.storage.local.set({ settings: settings });
}

// Toggle button
document.getElementById("toggleButton").addEventListener("click", () => {
  isActive = !isActive;

  if (isActive) {
    startRefresh();
    saveActiveState();
  } else {
    stopRefresh();
    clearActiveState();
  }

  updateUI();
});

function updateModeDisplay() {
  if (mode === "fixed") {
    document.getElementById("fixedInput").classList.remove("hidden");
    document.getElementById("randomInputs").classList.add("hidden");
  } else {
    document.getElementById("fixedInput").classList.add("hidden");
    document.getElementById("randomInputs").classList.remove("hidden");
  }
}

function convertToSeconds(value, unit) {
  switch (unit) {
    case "seconds":
      return value;
    case "minutes":
      return value * 60;
    case "hours":
      return value * 3600;
    default:
      return value;
  }
}

function getNextInterval() {
  if (mode === "fixed") {
    const value = parseInt(document.getElementById("fixedValue").value) || 5;
    return convertToSeconds(value, timeUnit);
  } else {
    const min = parseInt(document.getElementById("minValue").value) || 3;
    const max = parseInt(document.getElementById("maxValue").value) || 10;
    const minSeconds = convertToSeconds(min, timeUnit);
    const maxSeconds = convertToSeconds(max, timeUnit);
    return (
      Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds
    );
  }
}

function startRefresh() {
  nextRefresh = getNextInterval();
  countdown = nextRefresh;

  intervalId = setInterval(() => {
    countdown--;
    updateCountdown();

    if (countdown <= 0) {
      refreshPage();
      nextRefresh = getNextInterval();
      countdown = nextRefresh;
    }
  }, 1000);
}

function stopRefresh() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  countdown = 0;
  nextRefresh = 0;
}

function refreshPage() {
  if (tabId) {
    chrome.tabs.reload(tabId);

    // Show notification
    if (settings.notifications) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon128.png",
        title: "Auto Refresh",
        message: "Page refreshed successfully!",
        priority: 0,
      });
    }

    // Play sound (simple beep)
    if (settings.sound) {
      const audio = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGmi88OScTgwOUKnn77RgGwU7k9j0yXUpBSh+zPLaizsKGGS76+mjUBELTKXh8bllHAU2jdXzzn0vBSh7yvLdkEAKFF606+uoVRQKRp/g8r5sIQUrgc7y2Yk2CBlovPDknE4MDlCp5++0YBsFO5PY9Ml1KQUofszy2os7ChhluevsZ1UPCkSd3+68bB8FMI3X9NB+MgUlec3y3I5ACRFYr+zqpVkUCkef4PKva8QX2wvB"
      );
      audio.play().catch((e) => console.log("Sound play failed:", e));
    }
  }
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function updateCountdown() {
  document.getElementById("countdown").textContent = formatTime(countdown);
  const progress =
    nextRefresh > 0 ? ((nextRefresh - countdown) / nextRefresh) * 100 : 0;
  document.getElementById("progressBar").style.width = progress + "%";
}

function updateUI() {
  const toggleBtn = document.getElementById("toggleButton");
  const statusBox = document.getElementById("statusBox");
  const activeStatus = document.getElementById("activeStatus");
  const infoBox = document.getElementById("infoBox");

  if (isActive) {
    toggleBtn.textContent = "⏹ Stop Auto Refresh";
    toggleBtn.classList.remove("start-btn");
    toggleBtn.classList.add("stop-btn");
    statusBox.classList.remove("hidden");
    activeStatus.classList.remove("hidden");
    infoBox.classList.add("hidden");
  } else {
    toggleBtn.textContent = "▶ Start Auto Refresh";
    toggleBtn.classList.remove("stop-btn");
    toggleBtn.classList.add("start-btn");
    statusBox.classList.add("hidden");
    activeStatus.classList.add("hidden");
    infoBox.classList.remove("hidden");
  }
}

function saveActiveState() {
  const state = {
    mode: mode,
    timeUnit: timeUnit,
    value: parseInt(document.getElementById("fixedValue").value) || 5,
    min: parseInt(document.getElementById("minValue").value) || 3,
    max: parseInt(document.getElementById("maxValue").value) || 10,
  };
  chrome.storage.local.set({ [`active_${tabId}`]: state });
}

function clearActiveState() {
  chrome.storage.local.remove([`active_${tabId}`]);
}

// Handle window close
window.addEventListener("beforeunload", () => {
  if (!isActive) {
    clearActiveState();
  }
});

// Close settings modal when popup loads (ensure it starts closed)
document.addEventListener("DOMContentLoaded", () => {
  closeSettings();
});
