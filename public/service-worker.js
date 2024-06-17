// === Context Menu ===
// Add to the context menu. This is the menu when you right click in the web page.
// This adds "Define" to the context menu. When clicked, the listener is triggered below
// which executes "content-script.js".

function setupContextMenu() {
  chrome.contextMenus.create({
    id: "define-word",
    title: "Define",
    contexts: ["selection"],
  });
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

chrome.contextMenus.onClicked.addListener((data, tab) => {
  if (data.menuItemId === "define-word" && data.selectionText) {
    // Inject the content script
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content-script.js"],
    });
  }
});

// === Keyboard Command and Side Panels ===
// Uses the keyboard command in manifest.json command-shift-y to open the the side panel
chrome.commands.onCommand.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.sidePanel.open({ tabId: tab.id });
  });
});

// === Handling Messages from the content script ===
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "wordHover") {
    console.log("Received message", message);
    chrome.storage.session.set({
      context: message.context,
      word: message.word,
    });
  }
});
