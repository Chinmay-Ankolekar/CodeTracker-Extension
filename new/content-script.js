chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === 'getTabUrl') {
        sendResponse({ url: window.location.href });
    }
});
