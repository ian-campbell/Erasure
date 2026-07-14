(async function () {
  /* Re-injection guard: clicking the popup's delete button again (or
     re-pasting the script) while a run is active must not start a second,
     interleaved loop. The whole body is inside this IIFE so a duplicate
     injection skips everything. */
  if (window.__erasureRunning) {
    console.log("erasure: already running, ignoring second start.");
    return;
  }
  window.__erasureRunning = true;

  /* All page selectors live here. Each entry is an ordered list of
     candidates, tried until one matches; semantic hooks (aria/role) should
     come before Google's minified class names, which change on redeploys.
     `index` picks the Nth match within the queried root (default 0).
     `remembered` caches which candidate worked last, so the winning
     selector is tried first on every later query.

     NOTE aria-label matching is locale-limited (English UI only) — it is a
     resilience layer on top of the minified classes, not a replacement.

     Verified against the live My Activity comments page (July 2026):
     each comment is a card `div[role="listitem"][jsname="MFYZYe"]`
     (aria-label "Card showing an activity from YouTube") containing one
     `.YxbmAc` and exactly one delete button with
     aria-label "Delete activity item <comment text>". The action-menu
     layout (.VfPpkd-rymPhb-pZXsl) does not exist on this layout at all —
     it is kept only for the older/G-Suite variant. The minified X class
     also matches one non-item button elsewhere on the page, so it is only
     safe scoped within an item (which is how pick() uses it). */
  var SELECTORS = {
    // one activity item (a comment) in the My Activity list
    item: {
      candidates: [
        { css: '[jsname="MFYZYe"]' }, // the activity card (verified 2026-07)
        { css: ".YxbmAc" }, // legacy inner container (original selector)
        { css: 'div[role="listitem"][aria-label*="activity" i]' }, // English-locale fallback
      ],
      remembered: -1,
    },
    // the "Delete" entry of an item's action menu (legacy layouts only)
    deleteMenuItem: {
      candidates: [{ css: ".VfPpkd-rymPhb-pZXsl", index: 1 }],
      remembered: -1,
    },
    // the per-item "X" delete button — the primary path on current layouts
    deleteX: {
      candidates: [
        { css: 'button[aria-label*="delete" i]' }, // verified 2026-07
        { css: ".VfPpkd-Bz112c-LgbsSe" },
      ],
      remembered: -1,
    },
    /* One-time delete-confirmation dialog (Google shows it at most once per
       account, with a "don't ask again" checkbox). Best-effort: handled if
       it appears, never required. Selectors are unverified against a live
       dialog — it can't be re-triggered on an account that already
       confirmed it; the minified classes come from the legacy handler in
       development/live_chats.js. */
    confirmDialog: {
      candidates: [
        { css: 'div[role="alertdialog"]' },
        { css: 'div[role="dialog"]' },
      ],
      remembered: -1,
    },
    // the "don't ask again" checkbox inside the dialog
    confirmCheckbox: {
      candidates: [
        { css: 'input[type="checkbox"]' },
        { css: '[role="checkbox"]' },
        { css: ".VfPpkd-muHVFf-bMcfAe" }, // legacy handler's class
      ],
      remembered: -1,
    },
    // the dialog's confirm/OK action. clicking the wrong button here means
    // "Cancel" (a harmless stall + retry), so precise candidates come first
    confirmButton: {
      candidates: [
        { css: ".nCP5yc" }, // Material primary (filled) button, from the legacy handler
        { css: "button", index: -1 }, // structural: primary action is last in Material dialogs
      ],
      remembered: -1,
    },
  };

  // deletions kept in flight at once. Google's per-delete latency (~3 s
  // observed live) dominates a sequential run, so overlapping independent
  // deletes multiplies throughput when Google processes them in parallel
  // (and costs nothing when it serializes them). Automatically drops to 1
  // whenever the backoff is active; 1 = old sequential behavior.
  var CONCURRENCY = 3;

  // ms to wait for a clicked item to actually leave the DOM before counting
  // the attempt as failed. scaled by CONCURRENCY: Google has been observed
  // (July 2026 live run) to process an account's deletes one at a time at
  // ~3 s each, so with K clicks in flight the queue tail legitimately takes
  // ~K x 3 s to confirm — a fixed 5 s here causes false timeouts.
  var REMOVAL_TIMEOUT = 5000 * CONCURRENCY;

  // max ms to wait for infinite scroll to deliver more items after scrolling
  // at the end of the list. the moment new items are observed the loop
  // resumes — this is only the give-up fallback. useful for slow cpu/network.
  var NEW_ITEMS_TIMEOUT = 5000;

  // consecutive failed delete attempts before an item is skipped
  var FAILURE_LIMIT = 3;

  // consecutive empty re-checks (scroll + observe, NEW_ITEMS_TIMEOUT each)
  // that find nothing before declaring the run done
  var EMPTY_RECHECK_LIMIT = 3;

  // scroll for the next page (fire-and-forget) whenever fewer than this many
  // deletable items remain, so loading overlaps with the tail of deletions
  var LOW_WATER_MARK = 5;

  // adaptive backoff: when deletions time out (Google throttling or a slow
  // backend), wait between items and grow the wait; on success, shrink it.
  // steady state on a healthy connection is no artificial delay at all.
  var BACKOFF_INITIAL_MS = 1000; // first inter-item wait after a timeout
  var BACKOFF_GROWTH = 2; // multiply the wait by this on each further timeout
  var BACKOFF_MAX_MS = 30000; // never wait longer than this between items

  var attemptCount = 0; // total delete attempts this run
  var deletedCount = 0; // confirmed removals
  var totalDeleteMs = 0; // summed click-to-removal time for confirmed removals
  var skippedCount = 0; // items given up on after FAILURE_LIMIT failures
  var skippedItems = new Set(); // the given-up elements, excluded from nextItem()

  var failMap = new Map(); // per-item consecutive failed attempts
  var unconfirmedItems = new Set(); // clicked, timed out, never seen removed
  var inFlightItems = new Set(); // items whose deletion is currently in flight
  var inFlight = new Set(); // the in-flight attempt promises
  var emptyChecks = 0; // consecutive end-of-list re-checks that found nothing
  var backoffMs = 0; // current inter-item wait; 0 while deletions succeed

  var runStartedAt = null; // performance.now() when the loop began
  var stopRequested = false; // set by the popup's Stop button
  var currentState = "running"; // running | scrolling | done | error
  var currentDetail = "";

  // chrome.runtime is only available when injected as an extension content
  // script — feature-detect so pasting into the DevTools console still works
  var hasExtensionMessaging =
    typeof chrome !== "undefined" &&
    !!chrome.runtime &&
    !!chrome.runtime.sendMessage;

  // candidate indices for an entry, remembered winner first
  function candidateOrder(entry) {
    var order = [];
    if (entry.remembered >= 0) {
      order.push(entry.remembered);
    }
    for (var c = 0; c < entry.candidates.length; c++) {
      if (c !== entry.remembered) {
        order.push(c);
      }
    }
    return order;
  }

  function remember(entry, name, k) {
    if (entry.remembered !== k) {
      entry.remembered = k;
      console.debug(
        "erasure: selector '%s' matched via candidate %s (%s)",
        name,
        k,
        entry.candidates[k].css
      );
    }
  }

  /* Return the first element matching `name`'s candidates inside `root`,
     trying the remembered candidate first, then the rest in order.
     A candidate's `index` picks the Nth match; -1 means the last match. */
  function pick(root, name) {
    var entry = SELECTORS[name];
    var order = candidateOrder(entry);
    for (var k = 0; k < order.length; k++) {
      var cand = entry.candidates[order[k]];
      var nodes = root.querySelectorAll(cand.css);
      var idx = cand.index === -1 ? nodes.length - 1 : cand.index || 0;
      if (idx >= 0 && nodes.length > idx) {
        remember(entry, name, order[k]);
        return nodes[idx];
      }
    }
    return null;
  }

  // all activity items currently in the DOM (same remembered-first walk)
  function allItems() {
    var entry = SELECTORS.item;
    var order = candidateOrder(entry);
    for (var k = 0; k < order.length; k++) {
      var nodes = document.querySelectorAll(entry.candidates[order[k]].css);
      if (nodes.length > 0) {
        remember(entry, "item", order[k]);
        return Array.prototype.slice.call(nodes);
      }
    }
    return [];
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  /* Resolve true as soon as `element` is removed from the DOM, or false
     after timeoutMs. This is the feedback signal that lets the loop run at
     the page's real speed instead of a fixed delay. */
  function waitForRemoval(element, timeoutMs) {
    return new Promise(function (resolve) {
      if (!element.isConnected) {
        resolve(true);
        return;
      }
      function cleanup() {
        observer.disconnect();
        clearTimeout(timer);
      }
      var observer = new MutationObserver(function () {
        if (!element.isConnected) {
          cleanup();
          resolve(true);
        }
      });
      var timer = setTimeout(function () {
        cleanup();
        resolve(false);
      }, timeoutMs);
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  /* Resolve true as soon as the number of activity items in the DOM rises
     above where it started (infinite scroll delivered another page), or
     false after timeoutMs. My Activity shows a loading spinner while
     fetching, but there is no stable selector for it — newly added items
     are the source of truth. */
  function waitForNewItems(timeoutMs) {
    return new Promise(function (resolve) {
      var baseline = allItems().length;
      function cleanup() {
        observer.disconnect();
        clearTimeout(timer);
      }
      var observer = new MutationObserver(function () {
        if (allItems().length > baseline) {
          cleanup();
          resolve(true);
        }
      });
      var timer = setTimeout(function () {
        cleanup();
        resolve(false);
      }, timeoutMs);
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  // scroll to the bottom of the page
  function autoScroll() {
    window.scrollTo({
      left: 0,
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }

  // check for available comments
  function commentsAvailable2() {
    var n = allItems().length;
    if (n > 0) {
      console.log("erasure: %s comments are available.", n);
      return true;
    }
    return false;
  }

  // first comment item we haven't given up on or already dispatched
  function nextItem() {
    var items = allItems();
    for (var j = 0; j < items.length; j++) {
      if (!skippedItems.has(items[j]) && !inFlightItems.has(items[j])) {
        return items[j];
      }
    }
    return null;
  }

  // how many comment items remain to be dispatched
  function deletableCount() {
    var items = allItems();
    var n = 0;
    for (var j = 0; j < items.length; j++) {
      if (!skippedItems.has(items[j]) && !inFlightItems.has(items[j])) {
        n++;
      }
    }
    return n;
  }

  // visible enough to interact with (covers display:none and detached shells;
  // works for position:fixed dialogs where offsetParent is null)
  function isVisible(el) {
    return !!(el.getClientRects && el.getClientRects().length);
  }

  var warnedCheckboxOnlyDialog = false; // once-per-run warnings for dialogs
  var warnedDecorativeDialog = false; // we saw but chose not to touch

  /* Best-effort handler for Google's one-time delete-confirmation dialog:
     if it appears (immediately or while we wait for removal), tick the
     "don't ask again" checkbox and click confirm, then let the normal
     removal wait continue. Returns a stop() to call when the wait ends.

     Engage ONLY when the matched dialog has BOTH a checkbox and a confirm
     button. My Activity keeps other visible role="dialog" elements on the
     page permanently (observed live July 2026) — clicking into a
     loosely-matched dialog could hit unrelated UI, so anything that does
     not look exactly like the delete confirmation is left alone. */
  function watchForConsentDialog() {
    var handled = false;
    function tryHandle() {
      if (handled) {
        return;
      }
      var dialog = pick(document, "confirmDialog");
      if (!dialog || !isVisible(dialog)) {
        return;
      }
      var checkbox = pick(dialog, "confirmCheckbox");
      var confirmButton = pick(dialog, "confirmButton");
      if (!checkbox || !confirmButton) {
        if (checkbox && !confirmButton && !warnedCheckboxOnlyDialog) {
          warnedCheckboxOnlyDialog = true;
          console.log(
            "erasure: a dialog with a checkbox appeared but no confirm button matched — if deletions stall, confirm it manually once"
          );
        } else if (!checkbox && !warnedDecorativeDialog) {
          warnedDecorativeDialog = true;
          console.debug(
            "erasure: ignoring a visible dialog that doesn't look like the delete confirmation (no checkbox)"
          );
        }
        return; // keep watching; a real consent dialog may still appear
      }
      handled = true;
      var isChecked =
        checkbox.checked === true ||
        checkbox.getAttribute("aria-checked") === "true";
      if (!isChecked) {
        checkbox.click();
      }
      console.log(
        "erasure: consent dialog detected — ticking checkbox and confirming"
      );
      confirmButton.click();
    }
    tryHandle(); // it may already be open
    var observer = new MutationObserver(tryHandle);
    observer.observe(document.body, { childList: true, subtree: true });
    return function stop() {
      observer.disconnect();
    };
  }

  /* Click an item's delete control: the menu "Delete" entry, falling back
     to the per-item "X". Returns false if neither can be found. */
  function deleteClick(element) {
    var deleteButton = pick(element, "deleteMenuItem") || pick(element, "deleteX");
    if (!deleteButton) {
      console.log("erasure: could not find a delete button on item");
      return false;
    }
    deleteButton.click();
    return true;
  }

  /* An attempt on `item` ended without observed removal. If it is gone
     from the DOM anyway, the deletion landed late — count it. If it is
     still there, count a failure; after FAILURE_LIMIT consecutive
     failures the item is skipped. */
  function recordResult(item) {
    if (!item.isConnected) {
      failMap.delete(item);
      unconfirmedItems.delete(item);
      deletedCount++;
      console.debug("erasure: removal confirmed late for an item");
      report();
      return;
    }
    var n = (failMap.get(item) || 0) + 1;
    failMap.set(item, n);
    unconfirmedItems.add(item);
    console.log(
      "erasure: delete attempt %s of %s failed for this item",
      n,
      FAILURE_LIMIT
    );
    if (n >= FAILURE_LIMIT) {
      console.log("erasure: skipping an item that won't delete");
      failMap.delete(item);
      unconfirmedItems.delete(item);
      skippedItems.add(item);
      skippedCount++;
      report();
    }
  }

  /* Verify the page matches our selectors before touching anything.
     No items at all is NOT fatal (the history may simply be empty — the
     empty re-check flow will confirm and finish). Items with no matching
     delete control IS fatal: the layout changed and clicking blind would
     be wrong. */
  function selfCheck() {
    var items = allItems();
    if (items.length === 0) {
      console.log(
        "erasure: no activity items found at startup — history may be empty, or the page layout changed; watching for items before giving up."
      );
      return true;
    }
    if (!pick(items[0], "deleteMenuItem") && !pick(items[0], "deleteX")) {
      console.log(
        "erasure: page layout changed — selectors need updating (details: %s items found via '%s', but no delete-control candidate matched inside the first item; tried %s and %s)",
        items.length,
        SELECTORS.item.candidates[SELECTORS.item.remembered].css,
        JSON.stringify(
          SELECTORS.deleteMenuItem.candidates.map(function (c) {
            return c.css;
          })
        ),
        JSON.stringify(
          SELECTORS.deleteX.candidates.map(function (c) {
            return c.css;
          })
        )
      );
      return false;
    }
    return true;
  }

  /* Deletions whose confirmation landed while nothing was watching (wait
     expired, then Google's removal arrived) leave items tracked as failed
     or skipped but no longer on the page. Reconcile before summarizing so
     the counts reflect what actually happened. */
  function sweepLateRemovals() {
    var late = 0;
    unconfirmedItems.forEach(function (it) {
      if (!it.isConnected) {
        unconfirmedItems.delete(it);
        failMap.delete(it);
        deletedCount++;
        late++;
      }
    });
    skippedItems.forEach(function (it) {
      if (!it.isConnected) {
        skippedItems.delete(it);
        skippedCount--;
        deletedCount++;
        late++;
      }
    });
    if (late > 0) {
      console.log(
        "erasure: %s deletion(s) confirmed late — the item(s) left the page after their wait expired",
        late
      );
    }
  }

  function logSummary() {
    sweepLateRemovals();
    console.log(
      "erasure: summary — %s delete attempts made, %s deleted, %s items skipped.",
      attemptCount,
      deletedCount,
      skippedCount
    );
    if (deletedCount > 0) {
      console.log(
        "erasure: average time per deletion: %s ms",
        Math.round(totalDeleteMs / deletedCount)
      );
    }
    if (runStartedAt !== null && deletedCount > 0) {
      // wall-clock throughput is the honest speed metric under concurrency
      // (per-item latency includes server queue wait when Google serializes)
      var elapsedS = (performance.now() - runStartedAt) / 1000;
      console.log(
        "erasure: throughput — %s deletions in %s s (%s per minute)",
        deletedCount,
        Math.round(elapsedS),
        Math.round((deletedCount / elapsedS) * 600) / 10
      );
    }
  }

  function progressSnapshot() {
    return {
      type: "erasure:progress",
      state: currentState,
      detail: currentDetail,
      deleted: deletedCount,
      skipped: skippedCount,
      attempts: attemptCount,
    };
  }

  /* Broadcast progress to the popup. The popup is usually closed — a
     missing receiver must never throw or spam the console, so the
     lastError read below deliberately swallows it. */
  function report() {
    if (!hasExtensionMessaging) {
      return;
    }
    try {
      chrome.runtime.sendMessage(progressSnapshot(), function () {
        void chrome.runtime.lastError;
      });
    } catch (e) {
      // extension context invalidated (e.g. extension reloaded) — keep going
    }
  }

  // update state and broadcast, skipping no-op repeats
  function setState(state, detail) {
    detail = detail || "";
    if (state === currentState && detail === currentDetail) {
      return;
    }
    currentState = state;
    currentDetail = detail;
    report();
  }

  /* One deletion attempt: click the item's delete control and wait for the
     DOM to confirm removal. Runs concurrently with up to CONCURRENCY-1
     other attempts. */
  async function attemptOne(item) {
    attemptCount++;
    if (!deleteClick(item)) {
      // no delete button counts as a failed attempt on this item; wait as
      // long as a timed-out removal would have before it can be retried
      recordResult(item);
      await sleep(REMOVAL_TIMEOUT);
      return;
    }
    var started = performance.now();
    var removed = await waitForRemoval(item, REMOVAL_TIMEOUT);
    if (removed) {
      var elapsed = Math.round(performance.now() - started);
      deletedCount++;
      totalDeleteMs += elapsed;
      failMap.delete(item);
      unconfirmedItems.delete(item);
      console.debug("erasure: deleted in %s ms", elapsed);
      report();
      // recovery: shrink the inter-item wait back toward zero
      backoffMs = backoffMs / 2;
      if (backoffMs < BACKOFF_INITIAL_MS) {
        backoffMs = 0;
      }
    } else {
      // timed out: recordResult skips the item after FAILURE_LIMIT
      // failures, and while the backoff is active the pool runs at 1
      recordResult(item);
      backoffMs =
        backoffMs === 0
          ? BACKOFF_INITIAL_MS
          : Math.min(backoffMs * BACKOFF_GROWTH, BACKOFF_MAX_MS);
      console.log("erasure: slowing down, waiting %ss", backoffMs / 1000);
      setState("running", "slowing down, waiting " + backoffMs / 1000 + "s");
    }
  }

  // launch an attempt and track it until it settles
  function dispatch(item) {
    inFlightItems.add(item);
    var p = attemptOne(item)
      .catch(function (e) {
        console.log("erasure: unexpected error while deleting an item", e);
      })
      .then(function () {
        inFlightItems.delete(item);
        inFlight.delete(p);
        if (deletableCount() < LOW_WATER_MARK) {
          // start loading the next page while the tail drains
          autoScroll();
        }
      });
    inFlight.add(p);
  }

  /* Main loop: keep up to CONCURRENCY deletions in flight (1 while the
     backoff is active), each confirmed by observed DOM removal; skip items
     that repeatedly won't delete; only finish after repeated empty
     re-checks with nothing left in flight. */
  async function run() {
    while (true) {
      if (stopRequested) {
        if (inFlight.size > 0) {
          // let the already-clicked deletions settle so counts are honest
          await Promise.all(Array.from(inFlight));
        }
        return "stopped";
      }
      var limit = backoffMs > 0 ? 1 : CONCURRENCY;
      var dispatched = 0;
      while (inFlight.size < limit) {
        var item = nextItem();
        if (!item) {
          break;
        }
        emptyChecks = 0;
        dispatch(item);
        dispatched++;
      }
      if (dispatched > 0) {
        setState("running");
        commentsAvailable2();
      }
      if (inFlight.size === 0) {
        if (emptyChecks >= EMPTY_RECHECK_LIMIT) {
          return "complete";
        }
        emptyChecks++;
        setState(
          "scrolling",
          "watching for more items (check " +
            emptyChecks +
            " of " +
            EMPTY_RECHECK_LIMIT +
            ")"
        );
        console.log(
          "erasure: no deletable items visible, scrolling and watching up to %s ms for more (check %s of %s)",
          NEW_ITEMS_TIMEOUT,
          emptyChecks,
          EMPTY_RECHECK_LIMIT
        );
        autoScroll();
        var waitStarted = performance.now();
        var appeared = await waitForNewItems(NEW_ITEMS_TIMEOUT);
        if (appeared) {
          console.debug(
            "erasure: more items appeared after %s ms",
            Math.round(performance.now() - waitStarted)
          );
        }
        continue;
      }
      // wait for any in-flight deletion to settle, then refill the pool
      await Promise.race(Array.from(inFlight));
      if (backoffMs > 0) {
        console.debug("erasure: pacing, %s ms before next item", backoffMs);
        await sleep(backoffMs);
      }
    }
  }

  /* Popup control channel: "erasure:stop" flips the flag the loop checks
     each iteration; "erasure:status" answers with the current snapshot so
     a (re)opened popup can resume showing progress. The previous run's
     listener (if any) is replaced — the injection guard above guarantees
     no live run owns it. */
  if (hasExtensionMessaging && chrome.runtime.onMessage) {
    if (window.__erasureOnMessage) {
      chrome.runtime.onMessage.removeListener(window.__erasureOnMessage);
    }
    window.__erasureOnMessage = function (msg, sender, sendResponse) {
      if (msg && msg.type === "erasure:stop") {
        stopRequested = true;
        console.log("erasure: stop requested");
        sendResponse({ ok: true });
      } else if (msg && msg.type === "erasure:status") {
        sendResponse(progressSnapshot());
      }
    };
    chrome.runtime.onMessage.addListener(window.__erasureOnMessage);
  }

  try {
    if (selfCheck()) {
      runStartedAt = performance.now();
      report(); // announce the run to an already-open popup
      // one dialog watcher covers the whole run (attempts overlap now)
      var stopDialogWatch = watchForConsentDialog();
      var outcome;
      try {
        outcome = await run();
      } finally {
        stopDialogWatch();
      }
      if (outcome === "stopped") {
        console.log("erasure: stopped by user.");
        setState("done", "stopped by user");
      } else {
        console.log(
          "erasure: no more items after %s retries, done.",
          EMPTY_RECHECK_LIMIT
        );
        setState("done", "all items processed");
      }
    } else {
      setState("error", "page layout changed — selectors need updating (see console)");
    }
    logSummary();
  } catch (e) {
    console.log("erasure: unexpected error, stopping.", e);
    setState("error", "unexpected error: " + e);
    logSummary();
  } finally {
    window.__erasureRunning = false;
  }
})();
