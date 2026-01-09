// Background service worker for the extension
chrome.runtime.onInstalled.addListener(() => {
  console.log("Auto Refresh Pro installed");

  // Set default settings
  chrome.storage.local.get(["settings"], (result) => {
    if (!result.settings) {
      chrome.storage.local.set({
        settings: {
          autoStart: false,
          notifications: true,
          sound: false,
        },
      });
    }
  });

  // Create context menu - wrapped in try-catch
  try {
    chrome.contextMenus.create(
      {
        id: "autoRefresh",
        title: "Auto Refresh This Page",
        contexts: ["page"],
      },
      () => {
        if (chrome.runtime.lastError) {
          console.log("Context menu error:", chrome.runtime.lastError);
        }
      }
    );
  } catch (error) {
    console.log("Context menu not available:", error);
  }
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    // Check if auto-start is enabled
    chrome.storage.local.get(["settings", `active_${tabId}`], (result) => {
      if (
        result.settings &&
        result.settings.autoStart &&
        result[`active_${tabId}`]
      ) {
        // Auto-start is enabled and this tab had auto-refresh active
        console.log("Auto-starting refresh for tab:", tabId);
      }
    });
  }
});

// Listen for tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
  // Clean up storage for closed tab
  chrome.storage.local.remove([`active_${tabId}`]);
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "refresh") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  }
  return true;
});

// Context menu click handler - wrapped in try-catch
try {
  if (chrome.contextMenus && chrome.contextMenus.onClicked) {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (info.menuItemId === "autoRefresh") {
        // Send message to open popup (can't directly open popup from background)
        console.log("Context menu clicked");
      }
    });
  }
} catch (error) {
  console.log("Context menu handler error:", error);
}
