function getCurrentTabUrl(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'getTabUrl' }, function (response) {
            console.log(response)
            if (response !== undefined && response.url !== undefined)
                callback(response.url);
        });
    });
}

getCurrentTabUrl(function (url) {
    console.log('Current tab URL:', url)
    if (url && url.includes('leetcode.com/problems/')) {

    } else {
        statusField.innerText = 'Please open a leetcode problem page';
    }
});

