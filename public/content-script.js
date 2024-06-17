// The content script runs, effectively, inside the web page
// (not inside of the chrome extension web page)
// Think of this as the injected javascript into the
// base page so that the extension can interact with it.

// Add listeners that respond to on page activity
document.addEventListener("mousemove", function (event) {
  const clientX = event.clientX;
  const clientY = event.clientY;
  // console.info("Current mouse position:", clientX, clientY);
});

// The core of a chrome extension is message passing
// https://developer.chrome.com/docs/extensions/develop/concepts/messaging
const getText = () => {
  return document.body.innerText;
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_TEXT") {
    sendResponse(getText());
  }
});

// === DEMO ===
// Demo: show what the mouse is hovering over

let lastMessageSentTime = new Date().getTime();
let clientX = 0;
let clientY = 0;

function getMouseOverText(event) {
  // Helper function to get all textNodes related to a node
  function getTextNode(node) {
    let textNodes = [];

    function findTextNodes(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        textNodes.push(node);
      } else {
        for (const child of node.childNodes) {
          findTextNodes(child);
        }
      }
    }

    findTextNodes(node);
    return textNodes;
  }

  const element = document.elementFromPoint(clientX, clientY);
  if (element) {
    const range = document.createRange();
    const textNodes = getTextNode(element);

    if (!textNodes) {
      return null;
    }
    let offset = 0;
    let theTextNode = null;
    for (const textNode of textNodes) {
      range.selectNodeContents(textNode);
      for (let i = 0; i < textNode.length; i++) {
        range.setStart(textNode, i);
        range.setEnd(textNode, i + 1);
        const rect = range.getBoundingClientRect();

        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          offset = i;
          theTextNode = textNode;
          break;
        }
      }
    }
    const text = theTextNode.textContent;
    const before = text.slice(0, offset);
    const after = text.slice(offset);

    const start = before.lastIndexOf(" ") + 1;
    const end =
      after.indexOf(" ") === -1 ? text.length : offset + after.indexOf(" ");

    const word = text.slice(start, end);
    return { word, element };
  }
}

function getTextSelection() {
  const selection = window.getSelection();
  const selectedText = selection.toString();

  // Option 1: Add a span to it highlight
  if (selectedText.length > 0) {
    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.className = "highlighted";

    try {
      // Range particularly fails if the selection
      // is across more than just text, like across elements
      range.surroundContents(span);
    } catch (err) {
      // Ignore the error
      console.debug("Likely expected error from range.surroundContents", err);
    }
  }
  return selectedText;
}

async function checkForWord(event) {
  // If the shift key isn't down, return
  if (!event.shiftKey) {
    return;
  }

  const mouseOverText = getMouseOverText(event);

  // Can also do outerElement
  const word = mouseOverText.word;
  const context = mouseOverText.element.textContent;

  // Rate limit: Fire only once every x seconds
  const fireFrequency = 10; // 2000 for 2 seconds
  const curTimeInMS = new Date().getTime();
  if (lastMessageSentTime + fireFrequency > curTimeInMS) {
    return;
  }
  lastMessageSentTime = curTimeInMS;

  // Send the information about the hovered word to the service worker
  await chrome.runtime.sendMessage({
    action: "wordHover",
    word: word,
    context: context,
  });
}

(function () {
  // Set up event listeners for hovering over word functionality
  document.addEventListener("mousemove", function (event) {
    clientX = event.clientX;
    clientY = event.clientY;
  });
  document.addEventListener("keydown", checkForWord);
})();
