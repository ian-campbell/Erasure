
document.getElementsByClassName("dropdown-trigger style-scope ytd-menu-renderer")[0].click(); 

document.getElementsByClassName("yt-simple-endpoint style-scope ytd-menu-navigation-item-renderer")[1].click();

document.getElementsByClassName("yt-simple-endpoint style-scope yt-button-renderer")[1].click()

style-scope ytd-menu-navigation-item-renderer



document.getElementsByClassName("style-scope yt-icon-button")[0].click(); 
document.getElementsByClassName("style-scope ytd-comment-history-entry-renderer")[0].click(); 
style-scope ytd-comment-history-entry-renderer
style-scope yt-icon-button


//click on delete button private video
document.getElementsByClassName("style-scope ytd-menu-navigation-item-renderer")[1].click();



//click on 2nd delete button
document.getElementsByClassName("style-scope yt-button-renderer style-text size-default")[1].click()


style-scope yt-button-renderer style-text size-default

style-scope yt-icon-button

document.getElementsByClassName("style-scope yt-icon-button circle")[0].click(); 

style-scope yt-icon-button circle

style-scope ytd-menu-navigation-item-renderer


style-scope ytd-comment-history-entry-renderer

//2nd delete button class
style-scope yt-button-renderer style-text size-default


style-scope ytd-menu-navigation-item-renderer


style-scope ytd-menu-navigation-item-renderer




var DELAY = 0; // try 0, then try increasing values
var myList = document.getElementsByClassName("dropdown-trigger style-scope ytd-menu-renderer");
function confirmClick(callback3) {
    document.getElementsByClassName("style-scope yt-button-renderer style-text size-default")[1].click();
    setTimeout(callback3, DELAY);
}
function itemClick(callback2, callback3)  {
	document.getElementsByClassName("style-scope ytd-menu-navigation-item-renderer")[1].click();
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