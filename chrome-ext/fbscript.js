//doesnt work
function confirmClick(callback3) {
    setTimeout(callback3, 0);
}
function itemClick(callback2, i, callback3)  {
	var d = document.getElementsByClassName("_54nc");
	var elem = i;
	d[elem].click();
    setTimeout(callback2, 3000, callback3);
}
function listClick(element, callback1, callback2, i, callback3) {
    element.children[0].click();
    setTimeout(callback1, 0, callback2, i, callback3);
}
function doOne(i,n) {
	var myList = document.getElementsByClassName('_6a _6b uiPopover rfloat');
	var n = n;
	var p = n + 1;
	if (myList.length < 10 ) {
		window.scrollTo(0, document.body.scrollHeight);
	}
	if (myList[n].innerText === "Report/Remove Tag"){
    	++n;
	}

	if ()
	listClick(myList[n], itemClick, confirmClick, i, function() {
        ++i;
        if (i < myList.length) {
        	console.log('recursive step try');
            doOne(i,n);
        }
    });
}
setTimeout(doOne(0,0), 3000)
//doesnt work