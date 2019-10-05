let changeColor = document.getElementById('deleteComments');
let navigate = document.getElementById('navigate');

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
    chrome.tabs.query({ active: true, currentWindow: true}, function(tabs){
        chrome.tabs.update(tabs[0].id, {url:'https://www.youtube.com/feed/history/comment_history'})
    });
};
deleteFb.onclick = function(element) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs){
        chrome.tabs.executeScript(
            tabs[0].id, {file: 'fbscript.js'});
    });
};