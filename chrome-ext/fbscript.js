//better working script
function confirmClick(callback3) {
    console.log('confirmClick activated and passed');
    setTimeout(callback3, 0);
}
function itemClick(callback2, callback3)  {
	console.log('itemclick activated and passed');
	var d = document.getElementsByClassName("_54nc");
	console.log('list of delete buttons made');
	var elem = d.length - 1;
	console.log('last element number found');
	d[elem].click();
	console.log('delete button clicked');
    setTimeout(callback2, 3000, callback3);
}
function listClick(element, callback1, callback2, callback3) {
    element.children[0].click();
    console.log('listclick activated and passed');
    setTimeout(callback1, 0, callback2, callback3);
}
function doOne() {
	var myList = document.getElementsByClassName('_6a _6b uiPopover rfloat');
	var ll = myList.length;
	console.log(`${ll}`);
	if (myList.length < 10 ) {
		window.scrollTo(0, document.body.scrollHeight);
	}
	console.log('first list made')
	listClick(myList[0], itemClick, confirmClick, function() {
        	console.log('recursive step')
            doOne();
    });
}
setTimeout(doOne(), 3000)
//better working script

