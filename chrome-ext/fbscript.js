//best working script
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
function doOne(i) {
	var myList = document.getElementsByClassName('_6a _6b uiPopover rfloat');
	if (myList.length < 10 ) {
		window.scrollTo(0, document.body.scrollHeight);
	}
	listClick(myList[0], itemClick, confirmClick, i, function() {
        ++i;
        if (i < myList.length) {
        	console.log('recursive step')
            doOne(i);
        }
    });
}
setTimeout(doOne(0), 3000)
//best working script