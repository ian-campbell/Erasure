
// try 0, then try increasing values. this is delay between comment deletions
var DELAY = 0;

// if script ends but yt has more comments loading then increase this pause value.
// this provides 1 retry attempt between list updates. useful for slow cpu/network.
// (electronoob: 800 was the ideal value for my machine)
var PAUSE = 1000;

//first delete button
function itemClick(callback2)  {
    var buttonList = document.getElementsByClassName("style-scope yt-confirm-dialog-renderer style-text size-default");
    buttonList[0].click()
    setTimeout(callback2, DELAY);
}
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


function checkBox(){
    var checkbox = document.getElementsByClassName("VfPpkd-muHVFf-bMcfAe");
    if (checkbox.length > 0){  
        checkbox[0].checked = true;
        var c = document.getElementsByClassName("VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc");    
        c[0].click();
    }
}

/* Function for new YouTube comments history page */
function newOne(elements_coll, myFunc) {
    if(commentsAvailable2()) {
        Array.from(elements_coll).forEach(myFunc);
        }
    else {
        setTimeout( () => {
            if(commentsAvailable2()) {
                var e = document.getElementsByClassName("YxbmAc");
                Array.from(e).forEach(myFunc);
            }
            else{
                console.log("erasure: no more comments, exiting.");
            }
        },PAUSE );
    }
}


var myFunc = function(item, index){
    /*checkBox();*/
    item.querySelectorAll(".VfPpkd-rymPhb-pZXsl")[1].click();
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

//check for available comments in new YouTube Comment History page
function commentsAvailable2 () {
    var m = document.getElementsByClassName("YxbmAc");
    if(m.length > 0){
        return true;
    }
    return false;
}

function doOne(i) {
    if(commentsAvailable()) {
        var myList = document.getElementsByClassName("style-scope yt-button-renderer style-default size-default");
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

/* Determine which YouTube Comment History page is being displayed */
function wrapper(){
    var olde = document.getElementsByClassName("style-scope yt-button-renderer style-default size-default");
    var newe = document.getElementsByClassName("YxbmAc");
    if (olde.length > 0){
        doOne(0);
    }
    if (newe.length > 0){
        newOne(newe, myFunc);
    }
}

wrapper();


