let changeColor = document.getElementById('deleteComments');
let navigate = document.getElementById('navigate');
let deleteComments = document.getElementById('deleteComments');
let deleteLiveChats = document.getElementById('deleteLiveChats');
let liveChats = document.getElementById('liveChats');


chrome.storage.sync.get('color', function(data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});



//relevant code 
deleteComments.onclick = function(element) {
    let color = element.target.value;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id, { file: 'script.js' });
    });
};
navigate.onclick = function(element) {
    chrome.tabs.create({ active: true, url:'https://www.youtube.com/feed/history/comment_history'})
};

liveChats.onclick = function(element) {
    chrome.tabs.create({ active: true, url:'https://www.youtube.com/feed/history/live_chat_history'})
};

deleteLiveChats.onclick = function(element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.executeScript(
            tabs[0].id, { file: 'script.js' });
    });
};


