// try 0, then try increasing values. this is delay between comment deletions
var DELAY = 0;

// if script ends but yt has more comments loading then increase this pause value.
// this provides 1 retry attempt between list updates. useful for slow cpu/network.
// (electronoob: 800 was the ideal value for my machine)
var PAUSE = 1000;

function checkboxClick(element, callbackcheck){
    element.checked = true;
    setTimeout(callbackcheck, 200);
}
function checkboxOK(){
    var c = document.getElementsByClassName("VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc");    
    c[0].click();
}

/* Check for a Google permissions checkbox and check the checkbox and click OK */
/* Doesn't really work */
function checkBox(){

    var checkbox = document.getElementsByClassName("VfPpkd-muHVFf-bMcfAe");
    if (checkbox.length > 0){ 
        console.log("Checkbox found");
        setTimeout(checkboxClick, 200, checkbox[0], checkboxOK);
    }
    else{
        console.log("erasure: no checkbox");
    }
}

// scroll to the bottom of the page
function autoscroll () {
    window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
}

// check for available comments
function commentsAvailable2 () {
    var m = document.getElementsByClassName("YxbmAc");
    if(m.length > 0){
        console.log('erasure: comments are available.');
        return true;
    }
    return false;
}

/* Main function */
function main() {
    // check for available comments; if none, exit
    if (commentsAvailable2()) {
        //autoscroll();

        // create javascript collection of all comment elements
        var elements_coll = document.getElementsByClassName("YxbmAc");

        // run myFunc() for each element in the array
        Array.from(elements_coll).forEach(myFunc);

        // after array runs and there are no more comments, wait 1000ms
        console.log("erasure: attempting to retry in %s ms",PAUSE);

        // recursively run the main() function again
        setTimeout(()=>{
            main();
        },PAUSE);
    }
    // no comments available, exit
    else {
        console.log("erasure: there are no more comments, exiting.");
    }
}

/* This function clicks the delete button for both regular and 
   non-G-suite account users. */
var myFunc = function(item, index){
    //checkBox();
    try{ 
        item.querySelectorAll(".VfPpkd-rymPhb-pZXsl")[1].click();
    }
    catch{
        item.querySelectorAll(".VfPpkd-Bz112c-LgbsSe")[0].click();
    }
}

main();
