
// try 0, then try increasing values. this is delay between comment deletions
var DELAY = 0;

// if script ends but yt has more comments loading then increase this pause value.
// this provides 1 retry attempt between list updates. useful for slow cpu/network.
// (electronoob: 800 was the ideal value for my machine)
var PAUSE = 8000;

var myList = document.getElementsByClassName("style-scope yt-button-renderer style-default size-default");

//first delete button
function itemClick(callback2)  {
    var buttonList = document.getElementsByClassName("style-scope yt-confirm-dialog-renderer style-text size-default");
    buttonList[0].click()
    setTimeout(callback2, DELAY);
}

//open edit/delete menu
function listClick(element, callback1, callback2) {
    element.click();
    setTimeout(callback1, DELAY, callback2);
}

//check for available comments
function commentsAvailable () {
    for(x of document.getElementsByTagName("ytd-live-chat-history-entry-renderer")) {
        if(x.getAttribute("is-dismissed") == null) {
            return true;
        }
    }
    return false;
}

function doOne(i) {
    if(commentsAvailable()) {
        listClick(myList[i], itemClick, function() {
            ++i;
            if (i < myList.length) {
                doOne(i);
            }else {
                console.log("erasure: attempting to retry in %s ms",PAUSE);
                setTimeout(()=>{
                    doOne(0);
                },PAUSE);
            }
        });
    } else {
        console.log("erasure: there are no comments, exiting.");
    }
}

doOne(0);