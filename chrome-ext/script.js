// try 0, then try increasing values. this is delay between comment deletions
var DELAY = 200;

// if script ends but yt has more comments loading then increase this pause value.
// this provides 1 retry attempt between list updates. useful for slow cpu/network.
// (electronoob: 800 was the ideal value for my machine)
var PAUSE = 5000;

var myList = document.getElementsByClassName("YxbmAc");

// scroll to the bottom of the page
function autoScroll () {
    window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
}

// check for available comments
function commentsAvailable2 () {
    var m = document.getElementsByClassName("YxbmAc");
    if(m.length > 0){
        console.log('erasure: %s comments are available.', m.length);
        return true;
    }
    return false;
}

/* This function clicks the delete button for both regular and 
   non-G-suite account users. */
   function deleteClick(element, callback1){
    try{ 
        element.querySelectorAll(".VfPpkd-rymPhb-pZXsl")[1].click();
        setTimeout(callback1, DELAY);
    }
    catch{
        element.querySelectorAll(".VfPpkd-Bz112c-LgbsSe")[0].click();
        setTimeout(callback1, DELAY);
    }
}

/* Main function */
function main(i) {
    if(commentsAvailable2()) {
        deleteClick(myList[i], () => {
            ++i;
            if (i < myList.length) {
                main(i);
            }else {
                console.log("erasure: attempting to retry in %s ms",PAUSE);
                autoScroll();
                setTimeout(()=>{
                    main(0);
                },PAUSE);
            }
        });
    } else {
        console.log("erasure: there are no comments, exiting.");
    }
}

main(0);
