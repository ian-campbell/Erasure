// try 0, then try increasing values. this is delay between comment deletions
var DELAY = 0;

// if script ends but yt has more comments loading then increase this pause value.
// this provides 1 retry attempt between list updates. useful for slow cpu/network.
// (electronoob: 800 was the ideal value for my machine)
var PAUSE = 1000;


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
        var myList = document.getElementsByClassName("dropdown-trigger style-scope ytd-menu-renderer");
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

function checkboxClick(element, callbackcheck){
    element.checked = true;
    setTimeout(callbackcheck, PAUSE);
}
function checkboxOK(){
    var c = document.getElementsByClassName("VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc");    
    c[0].click();
}

/* Check for a Google permissions checkbox and check the checkbox and click OK */
function checkBox(){

    var checkbox = document.getElementsByClassName("VfPpkd-muHVFf-bMcfAe");
    if (checkbox.length > 0){ 
        console.log("Checkbox found");
        setTimeout(checkboxClick, PAUSE, checkbox[0], checkboxOK);
    }
    else{
        console.log("erasure: no checkbox");
    }
}

//check for available comments in new YouTube Comment History page
function commentsAvailable2 () {
    var m = document.getElementsByClassName("YxbmAc");
    if(m.length > 0){
        console.log('erasure: comments are available.');
        return true;
    }
    return false;
}

/* Updated function to delete comments on new comment history page */
function newOne() {
    if (commentsAvailable2()) {
        var elements_coll = document.getElementsByClassName("YxbmAc");
        Array.from(elements_coll).forEach(myFunc);
        console.log("erasure: attempting to retry in %s ms",PAUSE);
        setTimeout(()=>{
            newOne();
        },PAUSE);
    }
    else {
        console.log("erasure: there are no more comments, exiting.");
    }
}

var myFunc = function(item, index){
    checkBox();
    try{ 
        item.querySelectorAll(".VfPpkd-rymPhb-pZXsl")[1].click();
    }
    catch{
        item.querySelectorAll(".VfPpkd-Bz112c-LgbsSe")[0].click();
    }
}


/* Determine which YouTube Comment History page is being displayed */
function wrapper(){
    if (commentsAvailable()){
        doOne(0);
    }
    if (commentsAvailable2()){
        newOne();
    }
}

wrapper();
