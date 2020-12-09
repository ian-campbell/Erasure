// try 0, then try increasing values. this is delay between comment deletions
var DELAY = 0;

// if script ends but yt has more comments loading then increase this pause value.
// this provides 1 retry attempt between list updates. useful for slow cpu/network.
// (electronoob: 800 was the ideal value for my machine)
var PAUSE = 1000;

var myColl = document.getElementsByClassName("YxbmAc");


function checkBox(){
    var checkbox = document.getElementsByClassName("VfPpkd-muHVFf-bMcfAe");
    checkbox[0].checked = true;
    var c = document.getElementsByClassName("VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc");    
    c[0].click();

}




//check for available comments
function commentsAvailable () {
    var m = document.getElementsByClassName("YxbmAc");
    if(m.length > 0){
        return true;
    }
    return false;
}

var myfunc = function(item, index){

    item.querySelectorAll(".VfPpkd-rymPhb-pZXsl")[1].click();
};

function newOne(elements_coll) {
    if(commentsAvailable()) {
        Array.from(elements_coll).forEach(myfunc);
        }
    else {
        console.log("erasure: there are no comments, exiting.");
    }
}


newOne(myColl);

