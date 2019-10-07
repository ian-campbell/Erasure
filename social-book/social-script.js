






//main script functions:
//create collection of all Delete Menu buttons
var l = document.getElementsByClassName('_6a _6b uiPopover rfloat');
//open the first delete menu
//n starts at 0 and gets incremented 

if(l[n].innerTEXT === "Report/Remove Tag"){
    ++n;
}
l[n].children[0].click();
//check if the delete button says "Report/Remove tag"



var d = document.getElementsByClassName("_54nc");
//click the Delete button, i must be incremented from 0
d[i].click();


//main script functions
//new good function, all tables
p =document.getElementsByClassName('uiGrid _51mz _5f0n')






var DELAY = 7000; // try 0, then try increasing values
var myList = document.getElementsByClassName('_6a _6b uiPopover rfloat');


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
function doOne(i,n) {
	var myList = document.getElementsByClassName('_6a _6b uiPopover rfloat');
	var n = n;
	if (myList.length < 10 ) {
		window.scrollTo(0, document.body.scrollHeight);
	}
	if (l[n].innerText === "Report/Remove Tag"){
    	++n;
	}
	listClick(myList[n], itemClick, confirmClick, i, function() {
        ++i;
        if (i < myList.length) {
        	console.log('recursive step try');
            doOne(i,n);
        }
    });
}
setTimeout(doOne(0,0), 3000)
//best working script


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
	listClick(myList[0], itemClick, confirmClick, function() {
        	console.log('recursive step')
            doOne();
    });
}
setTimeout(doOne(), 3000)
//better working script
