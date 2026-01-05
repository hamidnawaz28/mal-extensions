const WORK_TIME = 1 * 60 * 1000;
const BREAK_TIME = 1 * 60 * 1000;

const statusLabel = document.getElementById("statusLabel");
const timeDisplay = document.getElementById("timeDisplay");
const resetBtn = document.getElementById("resetBtn");
const breakStatus = document.getElementById("breakStatus");
const breakInfo = document.getElementById("breakInfo");
const blockInfo = document.getElementById("blockInfo");

// Update display every second
setInterval(updateDisplay, 1000);
updateDisplay();

// Reset button
resetBtn.addEventListener("click", async () => {
  chrome.runtime.sendMessage({ action: "resetTimer" }, () => {
    updateDisplay();
  });
});

async function updateDisplay() {
  const data = await chrome.storage.sync.get([
    "startTime",
    "isOnBreak",
    "breakEndTime",
  ]);

  if (data.isOnBreak) {
    breakStatus.style.display = "block";
    statusLabel.textContent = "Break time remaining:";
    breakInfo.style.display = "none";
    blockInfo.style.display = "block";

    const remaining = data.breakEndTime - Date.now();
    timeDisplay.textContent = formatTime(Math.max(0, remaining));

    if (remaining <= 0) {
      timeDisplay.textContent = "00:00";
      statusLabel.textContent = "Break ending...";
    }
  } else {
    breakStatus.style.display = "none";
    statusLabel.textContent = "Time until break:";
    breakInfo.style.display = "block";
    blockInfo.style.display = "none";

    const elapsed = Date.now() - data.startTime;
    const remaining = WORK_TIME - elapsed;
    timeDisplay.textContent = formatTime(Math.max(0, remaining));

    if (remaining <= 0) {
      timeDisplay.textContent = "00:00";
      statusLabel.textContent = "Break time!";
    }
  }
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
