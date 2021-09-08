// How long to wait for more comments to stream in after scrolling to the bottom.
const LOAD_MORE_DELAY = 5000;

var deletedTotal = 0;
// Did we delete any comments last time we autoscrolled?
var deletedLastRefresh = 0;
// How many comments did we delete since autoscrolling?
var deletedThisRefresh = 0;
// If we didn't delete any comments this time, and we didn't delete any last time,
// there are probably no more comments to load and the script will end.

// Reset each time we click a delete button; used to continue making progress even if
// we miss a DOM update for some reason.
var pendingDeleteTimer = null;
const DELETE_TIMEOUT = 5000;
var deletionsTimedOut = 0;
// If pendingDeleteTimer is allowed to tick this many times the script will end
// because comments are not being removed from the list after being clicked.
const MAX_TIMEOUTS_BEFORE_QUITTING = 5;

// Observe this for changes to detect when the comment is successfully deleted.
// The comment is hidden on click, but the list is not mutated until the backend
// returns success.
const commentListElement = document.body.getElementsByClassName("ez10qf")[0];
var deletedObserver = new MutationObserver((mutations, observer) => {
  ++deletedThisRefresh;
  ++deletedTotal;
  recursivelyClickDelete();
});


function loadMoreComments() {
  if (!deletedThisRefresh && !deletedLastRefresh) {
    console.log("erasure: no more comments to delete. We're done!");
    return;
  }

  deletedLastRefresh = deletedThisRefresh;
  deletedThisRefresh = 0;

  console.log(
    "erasure: scrolling to bottom and waiting %d ms for more comments to load", LOAD_MORE_DELAY
  );

  // Scroll to the bottom of the page
  window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
  // Wait for more comments to stream in
  setTimeout(recursivelyClickDelete, LOAD_MORE_DELAY);
}

/* This function clicks the delete button for both regular and 
   non-G-suite account users. */
function recursivelyClickDelete() {
  // Don't respond to changes unless we just clicked a button
  deletedObserver.disconnect();
  // Stop waiting for the last click to fail and just continue with the next one
  if (pendingDeleteTimer) {
    clearTimeout(pendingDeleteTimer);
  }

  var buttons = document.body.querySelectorAll(".YxbmAc .VfPpkd-rymPhb-pZXsl");
  if (!buttons || !buttons.length) {
    buttons = document.body.querySelectorAll(".YxbmAc .VfPpkd-Bz112c-LgbsSe");
  }
  if (!buttons || !buttons.length) {
    console.log(
      "erasure: deleted %d %s (%d total); attempting to load more", 
      deletedThisRefresh, (deletedThisRefresh == 1 ? "comment" : "comments"),
      deletedTotal
    );
    loadMoreComments();
    return;
  }

  try {
    let btn = buttons[0];
    if (!btn || !btn.click) {
      throw "can't find button with click()";
    }
    // Watch the list for the comment to be removed so we can continue deleting.
    deletedObserver.observe(commentListElement, { subtree: true, childList: true });
    btn.click();

    // Start waiting to continue even if we don't see the list update.
    // I don't know under what circumstances we'd hit this, but I'd rather not be surprised
    // by a missed event causing the extension to quietly fail.
    pendingDeleteTimer = setTimeout(() => {
      if (++deletionsTimedOut >= MAX_TIMEOUTS_BEFORE_QUITTING) {
        console.error("erasure: timed out waiting for %d comments to be deleted. Quitting...");
        return;
      }
      console.warn("erasure: timed out waiting for comment to be removed after clicking delete.");
      ++deletionsTimedOut;
      recursivelyClickDelete();
    }, DELETE_TIMEOUT);

  } catch (ex) {
    console.warn("erasure: exception clicking delete button: " + ex);
  }
}

// Entrypoint
recursivelyClickDelete();