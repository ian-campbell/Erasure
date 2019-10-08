






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
var p = document.getElementsByClassName('uiGrid _51mz _5f0n')

p[0].querySelector('._42ef').innerText
p[0].querySelector('#u_fetchstream_2_1')

//breakthrough, use dots instead of spaces in classname 
document.querySelector('div._6a._6b.uiPopover.rfloat')
var arf = document.querySelectorAll('._6a._6b.uiPopover.rfloat')
arf[i].children[0].click()
var d = document.getElementsByClassName("_54nc");
if (d[n].innerText === "Report/Remove Tag"){
    	++n;
}

var n = 0;
function myFunc(i,n){
	var arf = document.querySelectorAll('._6a._6b.uiPopover.rfloat')
	arf[n].children[0].click()
	var ee = document.querySelectorAll("._54nc");
	if (ee[n].innerText === "Report/Remove Tag"){
	    ++n;
	    myFunc(i, n)
	}
	else {
		++n;
	}
}

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
function itemClick(callback2, i, callback3)  {
	var d = document.getElementsByClassName("_54nc");
	var elem = i;
	d[elem].click();
    setTimeout(callback2, 3000, callback3);
}
function listClick(element, callback1, callback2, i, callback3) {
    element.children[0].click();
    setTimeout(callback1, 3000, callback2, i, callback3);
}
function doOne(i,n) {
	console.log(`doOne step ${i}`)
	var myList = document.querySelectorAll('._6a._6b.uiPopover.rfloat');
	var n = n;
	myList[n].children[0].click()
	var d = document.getElementsByClassName("_54nc");

	//check if button is for reporting a mention
	if (d[i].innerText === "Report/Remove Tag"){
	    ++n;
	    ++i;
	    doOne(i,n);
	}
	//scroll down if list is less than 10
	if (myList.length < 10 ) {
		window.scrollTo(0, document.body.scrollHeight);
	}

	listClick(myList[n], itemClick, confirmClick, i, function() {
        ++i;
        if (i < myList.length) {
        	console.log(`${i} ${n}`)
            setTimeout(doOne(i,n), 6000);
        }
    });
}
setTimeout(doOne(0,0), 6000)
//better working script
