//better working script
function confirmClick(callback3) {
    setTimeout(callback3, 0);
}
function itemClick(callback2, callback3)  {
	var d = document.getElementsByClassName("_54nc");
	var elem = d.length - 1;
	d[elem].click();
    setTimeout(callback2, 3000, callback3);
}
function listClick(element, callback1, callback2, callback3) {
    element.children[0].click();
    setTimeout(callback1, 0, callback2, callback3);
}
function doOne() {
	var myList = document.getElementsByClassName('_6a _6b uiPopover rfloat');
	var ll = myList.length;
	if (myList.length < 10 ) {
		window.scrollTo(0, document.body.scrollHeight);
	}
	
	listClick(myList[0], itemClick, confirmClick, function() {
    	console.log('recursive step')
        doOne();
    });
}
setTimeout(doOne(), 3000)
//better working script

