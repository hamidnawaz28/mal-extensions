const WORK_MIN_DEFAULT = 45;
const BREAK_MIN_DEFAULT = 15;

const workInput = document.getElementById("workInput");
const breakInput = document.getElementById("breakInput");

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");

const timeDisplay = document.getElementById("timeDisplay");
const statusLabel = document.getElementById("statusLabel");
const breakStatus = document.getElementById("breakStatus");
const breakInfo = document.getElementById("breakInfo");
const blockInfo = document.getElementById("blockInfo");

/* -------------------- INIT -------------------- */

(async function init() {
  const data = await chrome.storage.sync.get([
    "workDurationMs",
    "breakDurationMs",
    "isRunning",
  ]);

  workInput.value = (data.workDurationMs || WORK_MIN_DEFAULT * 60000) / 60000;
  breakInput.value =
    (data.breakDurationMs || BREAK_MIN_DEFAULT * 60000) / 60000;

  updateStartStopUI(data.isRunning);
})();

/* -------------------- UI HELPERS -------------------- */

function updateStartStopUI(isRunning) {
  startBtn.style.display = isRunning ? "none" : "block";
  stopBtn.style.display = isRunning ? "block" : "none";
  resetBtn.style.display = isRunning ? "block" : "none";
}

/* -------------------- BUTTONS -------------------- */

startBtn.addEventListener("click", async () => {
  await chrome.storage.sync.set({
    workDurationMs: Number(workInput.value) * 60000,
    breakDurationMs: Number(breakInput.value) * 60000,
  });

  chrome.runtime.sendMessage({ action: "startTimer" });
  updateStartStopUI(true);
});

stopBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "stopTimer" });
  updateStartStopUI(false);
});

resetBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "resetTimer" });
  updateStartStopUI(true);
});

/* -------------------- TIMER DISPLAY -------------------- */

setInterval(updateDisplay, 1000);
updateDisplay();

async function updateDisplay() {
  const data = await chrome.storage.sync.get([
    "startTime",
    "isRunning",
    "isOnBreak",
    "breakEndTime",
    "workDurationMs",
  ]);

  if (!data.isRunning) {
    timeDisplay.textContent = "--:--";
    statusLabel.textContent = "Timer stopped";
    breakStatus.style.display = "none";
    breakInfo.style.display = "block";
    blockInfo.style.display = "none";
    return;
  }

  if (data.isOnBreak) {
    breakStatus.style.display = "block";
    statusLabel.textContent = "Break time remaining:";
    breakInfo.style.display = "none";
    blockInfo.style.display = "block";

    timeDisplay.textContent = formatTime(
      Math.max(0, data.breakEndTime - Date.now())
    );
  } else {
    breakStatus.style.display = "none";
    statusLabel.textContent = "Time until break:";
    breakInfo.style.display = "block";
    blockInfo.style.display = "none";

    timeDisplay.textContent = formatTime(
      Math.max(0, data.workDurationMs - (Date.now() - data.startTime))
    );
  }
}

/* -------------------- FORMAT -------------------- */

function formatTime(ms) {
  if (ms <= 0) return "00:00";

  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

/* -------------------- STORAGE SYNC -------------------- */

chrome.storage.onChanged.addListener((changes) => {
  if (changes.isRunning) {
    updateStartStopUI(changes.isRunning.newValue);
  }
});
