_42ft _42fu _4-s1 _2agf _4o_4 _p _42gx

document.getElementsByClassName("_42ft _42fu _4-s1 _2agf _4o_4 _p _42gx")[0].click(); 


_54nc

document.getElementsByClassName("_54nc")[0].click(); 


_54ni __MenuItem

document.getElementsByClassName("_54ni __MenuItem")[0].click(); 


//function
var mylist = document.getElementsByClassName("_42ft _42fu _4-s1 _2agf _4o_4 _p _42gx");
function erasure(){
	for (i=0; i<mylist.length;){
		mylist[0].click(); 
		document.getElementsByClassName("_54nc")[i].click(); 
		i++;
	}
}
erasure();
setTimeout(erasure(), 1000);

var mylist = document.getElementsByClassName("_42ft _42fu _4-s1 _2agf _4o_4 _p _42gx");
for (var i = 0; i < mylist.length;) {
  (function (i) {
    setTimeout(function () {
      mylist[0].click(); 
		document.getElementsByClassName("_54nc")[i].click(); 
		i++;
    }, 3000*i);
  })(i);
};




var DELAY = 3000; // try 0, then try increasing values
var myList = document.getElementsByClassName('_6a _6b uiPopover rfloat');
function confirmClick(callback2) {
	document.getElementsByClassName("_54nc")[i].click();
    setTimeout(callback2, DELAY);
}

function listClick(element, callback1, callback2) {
    element.children[0].click();
    setTimeout(callback1, DELAY, callback2);
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


//main script functions:
//creates collection of all Delete Menu buttons
l = document.getElementsByClassName('_6a _6b uiPopover rfloat');
//opens the first delete menu
l[0].children[0].click();
//clicks the Delete button
var d = document.getElementsByClassName("_54nc");
var elem = d.length - 1
if elem >= 0 {
	d[elem].click();
}
//main script functions


var myList = document.getElementsByClassName('_6a _6b uiPopover rfloat');
function stateChange() {
	myList = document.getElementsByClassName('_6a _6b uiPopover rfloat');

	for (var i=0; i<myList.length; i++){

		setTimeout(function (){
			myList[0].children[0].click();
			setTimeout(function (){
				document.getElementsByClassName("_54nc")[i].click();
			}, 5000);
		}, 5000);	
	}
}
stateChange(myList)





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


window.onload = function() {
    var reloading = sessionStorage.getItem("reloading");
    if (reloading) {
        sessionStorage.removeItem("reloading");
        setTimeout(doOne(), 3000);
    }
}

document.querySelectorAll('a[ajaxify="/allactivity/removecontent/?category_key=commentscluster&action=remove_comment&ent_identifier=S%3A_I5742869%3A2160634354040540%3A23&story_dom_id=u_4t_4&timeline_token=5742869%3A2160634354040540%3A23%3A1570053191%3A1570040366"]');

$('a[ajaxify="/allactivity/removecontent/?category_key=commentscluster&action=remove_comment&ent_identifier=S%3A_I5742869%3A2160634354040540%3A23&story_dom_id=u_4t_4&timeline_token=5742869%3A2160634354040540%3A23%3A1570053191%3A1570040366"]')


ajaxify = "/allactivity/removecontent/?category_key=commentscluster&action=remove_comment&ent_identifier=S%3A_I5742869%3A2160634354040540%3A23&story_dom_id=u_4t_4&timeline_token=5742869%3A2160634354040540%3A23%3A1570053191%3A1570040366"

ajaxify_2 = "/allactivity/removecontent/?category_key=commentscluster&action=remove_comment&ent_identifier=S%3A_I5742869%3A2160634354040540%3A21&story_dom_id=u_4t_a&timeline_token=5742869%3A2160634354040540%3A21%3A1570052530%3A1570040366"





