chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (
    request.messageType === "GET_DATA" &&
    request.url.includes("facebook.com/groups")
  ) {
    chrome.windows.create(
      {
        url: request.url,
        focused: true,
        width: 950,
        height: 775,
        top: Math.round((screen.height - 775) / 2),
        left: Math.round((screen.width - 950) / 2),
        type: "popup",
        setSelfAsOpener: true,
      },
      ({ tabs: [newTab] }) => {
        console.log(newTab.id);
        chrome.storage.local.set(
          { windowId: newTab.windowId, tabId: newTab.id },
          () => {
            chrome.tabs.executeScript(newTab.id, {
              file: "scripts/capture-emails.js",
            });
          }
        );
      }
    );
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.storage.local.get(["tabId"], ({ tabId }) => {
    console.log(tab.id, tabId);
    if (tabId == tab.id) {
      chrome.tabs.executeScript(tabId, { file: "scripts/capture-emails.js" });
    }
  });
});
