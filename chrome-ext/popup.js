const deletionScript = "script.js";

// pages the deletion script knows how to operate on: Google My Activity,
// or the youtube.com history URLs that redirect there
const HISTORY_URL_PATTERNS = [
  /^https:\/\/myactivity\.google\.com\//,
  /^https:\/\/www\.youtube\.com\/feed\/history\//,
];

function isHistoryPage(url) {
  return (
    !!url &&
    HISTORY_URL_PATTERNS.some(function (re) {
      return re.test(url);
    })
  );
}

// ---- status line + stop control ----

function setStatus(text, isError) {
  statusText.textContent = text;
  statusText.style.color = isError ? "#ff8a80" : "#ffffff";
}

function renderProgress(p) {
  if (!p || !p.state) {
    return;
  }
  var counts =
    p.deleted + " deleted" + (p.skipped ? ", " + p.skipped + " skipped" : "");
  var detail = p.detail ? " — " + p.detail : "";
  if (p.state === "running") {
    setStatus("Running: " + counts + detail);
  } else if (p.state === "scrolling") {
    setStatus("Loading more items… " + counts + detail);
  } else if (p.state === "done") {
    setStatus("Done: " + counts + detail);
  } else if (p.state === "error") {
    setStatus("Error" + (p.detail ? ": " + p.detail : " — see page console"), true);
  }
}

// live progress broadcast by the injected script
chrome.runtime.onMessage.addListener(function (msg) {
  if (msg && msg.type === "erasure:progress") {
    renderProgress(msg);
  }
});

function withActiveTab(fn) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs && tabs[0]) {
      fn(tabs[0]);
    }
  });
}

// on (re)open, ask the active tab where things stand; no receiver = no run
withActiveTab(function (tab) {
  chrome.tabs.sendMessage(tab.id, { type: "erasure:status" }, function (resp) {
    if (chrome.runtime.lastError || !resp) {
      setStatus("Idle");
      return;
    }
    renderProgress(resp);
  });
});

stopButton.onclick = function () {
  withActiveTab(function (tab) {
    chrome.tabs.sendMessage(tab.id, { type: "erasure:stop" }, function (resp) {
      if (chrome.runtime.lastError || !resp) {
        setStatus("Nothing running in this tab");
      } else {
        setStatus("Stopping…");
      }
    });
  });
};

// ---- navigate / delete buttons ----

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
  tabs.query({ active: true, currentWindow: true }, function (tabList) {
    var tab = tabList && tabList[0];
    if (!tab) {
      return;
    }
    // activeTab (granted by opening the popup) exposes tab.url here — no
    // "tabs" permission needed. An unreadable url is treated as wrong-page.
    if (!isHistoryPage(tab.url)) {
      setStatus(
        "This tab isn't a YouTube history page — click a navigate button first.",
        true
      );
      return;
    }
    setStatus("Starting…");
    scripting
      .executeScript({
        target: { tabId: tab.id, allFrames: true },
        files: [deletionScript],
      })
      .catch(function (e) {
        setStatus("Could not start on this page: " + e.message, true);
      });
  });
}
