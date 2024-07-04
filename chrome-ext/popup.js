const baseActivityPageURL =
  "https://myactivity.google.com/page?utm_source=my-activity&hl=en&page=";
const deletionScript = "script.js";


// comment history
deleteCommentHistory.onclick = function (element) {
  executeScriptInTab(chrome.tabs, chrome.scripting);
};
commentHistory.onclick = function (element) {
  openTab(chrome.tabs, "https://www.youtube.com/feed/history/comment_history");
};

// live chat history
deleteLiveChats.onclick = function (element) {
  executeScriptInTab(chrome.tabs, chrome.scripting);
};

liveChats.onclick = function (element) {
  openTab(chrome.tabs, "https://www.youtube.com/feed/history/live_chat_history");
};

// community posts
deleteCommunityPosts.onclick = function (element) {
  executeScriptInTab(chrome.tabs, chrome.scripting);
};

communityPosts.onclick = function (element) {
  openTab(chrome.tabs, "https://myactivity.google.com/page?utm_source=my-activity&hl=en&page=youtube_posts_activity");
};

// reusable functions
function openTab(tabs, page) {
  targetPage = page;
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
