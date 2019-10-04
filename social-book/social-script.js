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

for (var i = 0; i<mylist.length)

var mylist = document.getElementsByClassName("_42ft _42fu _4-s1 _2agf _4o_4 _p _42gx");
var i;
for (i=0; i < mylist.length) {

}

var DELAY = 0; // try 0, then try increasing values
var myList = document.getElementsByClassName("_42ft _42fu _4-s1 _2agf _4o_4 _p _42gx");

function itemClick(callback2, e)  {
	document.getElementsByClassName("_54nc")[e].click(); 
    setTimeout(callback2, DELAY);
}
function listClick(element, callback1, callback2) {
    element.click();
    setTimeout(callback1, DELAY, callback2);
}

function doOne(i) {
    listClick(myList[i], itemClick[i], function() {
        ++i;
        if (i < myList.length) {
            doOne(i);
        }
    });
}
doOne(0);