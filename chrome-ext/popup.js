const baseActivityPageURL =
  "https://myactivity.google.com/page?utm_source=my-activity&hl=en&page=";
const deletionScript = "script.js";

//relevant code

// comment history
deleteCommentHistory.onclick = function (element) {
  executeScriptInTab(chrome.tabs, chrome.scripting);
};
commentHistory.onclick = function (element) {
  openTab(chrome.tabs, "youtube_comments");
};

// live chat history
deleteLiveChats.onclick = function (element) {
  executeScriptInTab(chrome.tabs, chrome.scripting);
};

liveChats.onclick = function (element) {
  openTab(chrome.tabs, "youtube_live_chat");
};

// community posts
deleteCommunityPosts.onclick = function (element) {
  executeScriptInTab(chrome.tabs, chrome.scripting);
};

communityPosts.onclick = function (element) {
  openTab(chrome.tabs, "youtube_posts_activity");
};

// reusable functions
function openTab(tabs, page) {
  targetPage = baseActivityPageURL + page;
  tabs.create({
    active: true,
    url: targetPage,
  });
}

function executeScriptInTab(tabs, scripting) {
  tabs.query({ active: true, currentWindow: true }, function (tabs) {
    scripting.executeScript({
      target: { tabId: tabs[0].id, allFrames: true },
      files: [deletionScript],
    });
  });
}
