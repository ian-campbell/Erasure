// try 0, then try increasing values. this is delay between comment deletions
var DELAY = 0;

// if script ends but yt has more comments loading then increase this pause value.
// this provides 1 retry attempt between list updates. useful for slow cpu/network.
// (electronoob: 800 was the ideal value for my machine)
var PAUSE = 1000;

var myList = document.getElementsByClassName("YxbmAc");


var checkbox = document.getElementsByClassName("VfPpkd-muHVFf-bMcfAe");
checkbox[0].checked = true;
var c = document.getElementsByClassName("VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc");
c[0].click();


//second delete button
function confirmClick(callback3) {
    try{
        document.getElementsByClassName("yt-simple-endpoint style-scope yt-button-renderer")[1].click();
    }
    catch{
        document.getElementsByClassName("style-scope yt-button-renderer style-text size-default")[1].click();
    }
    setTimeout(callback3, DELAY);
}

//first delete button
function itemClick(callback2, callback3)  {
    try {
        document.getElementsByClassName("yt-simple-endpoint style-scope ytd-menu-navigation-item-renderer")[1].click();
    }
    catch{
        document.getElementsByClassName("style-scope ytd-menu-navigation-item-renderer")[1].click();
    }
    setTimeout(callback2, DELAY, callback3);
}

//open edit/delete menu
function listClick(element, callback1, callback2, callback3) {
    element.click();
    setTimeout(callback1, DELAY, callback2, callback3);
}

//check for available comments
function commentsAvailable () {
    for(x of document.getElementsByTagName("ytd-comment-history-entry-renderer")) {
        if(x.getAttribute("is-dismissed") == null) {
            return true;
        }
    }
    return false;
}

function doOne(i) {
    if(commentsAvailable()) {
        listClick(myList[i], itemClick, confirmClick, function() {
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

