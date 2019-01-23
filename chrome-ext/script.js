var DELAY = 0; // try 0, then try increasing values
var myList = document.getElementsByClassName("dropdown-trigger style-scope ytd-menu-renderer");
function confirmClick(callback3) {
    document.getElementsByClassName("yt-simple-endpoint style-scope yt-button-renderer")[1].click();
    setTimeout(callback3, DELAY);
}
function itemClick(callback2, callback3)  {
    document.getElementsByClassName("yt-simple-endpoint style-scope ytd-menu-navigation-item-renderer")[1].click();
    setTimeout(callback2, DELAY, callback3);
}
function listClick(element, callback1, callback2, callback3) {
    element.click();
    setTimeout(callback1, DELAY, callback2, callback3);
}
function doOne(i) {
    listClick(myList[i], itemClick, confirmClick, function() {
        ++i;
        if (i < myList.length) {
            doOne(i);
        }
    });
}
doOne(0);