<<<<<<< HEAD
// final script using callbacks
=======

//each of these lines, when run individually one after another, delete a comment

document.getElementsByClassName("dropdown-trigger style-scope ytd-menu-renderer")[0].click(); 

document.getElementsByClassName("style-scope ytd-menu-navigation-item-renderer")[4].click();

document.getElementById("confirm-button").click();



// final script using callbacks, deletes all comments
>>>>>>> 23f610cca83fbbec27754f402504cd2c449e1aca

var DELAY = 0; // try 0, then try increasing values
var myList = document.getElementsByClassName("dropdown-trigger style-scope ytd-menu-renderer");
function confirmClick(callback3) {
    document.getElementById("confirm-button").click();
    setTimeout(callback3, DELAY);
}
function itemClick(callback2, callback3)  {
    document.getElementsByClassName("style-scope ytd-menu-navigation-item-renderer")[4].click();
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
