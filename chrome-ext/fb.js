/*
This script will delete Facebook comments, but gets
blocked after deleting a certain number. To run it, go to your
Activity Log, open the filter, select "Comments", and save.
Then paste this script into your javascript console and run it. 
*/
const PAUSE = 2000;
const RELOAD = 5000;
clik = () => {
    var s = document.querySelectorAll('[data-pagelet="root"]');
    try{
        s[2].getElementsByTagName('i')[0].click();
    }
    catch{
        setTimeout(()=>{
            s[2].getElementsByTagName('i')[0].click();
        }, 1500)
    }   
}

// creates a list of all comments on the screen
getList = () => {
    var n = document.querySelectorAll('[aria-label="Action options"]');
    return n;
}

queryErrorCheck = () => {
    let e = document.querySelectorAll('[aria-label="Query Error"]');
    if (e.length >= 1){
        return true;
    }
    else{
        return false;
    }
}

//check for available comments
commentsAvailable = () => {
    let comments = document.querySelectorAll('[aria-label="Action options"]');
    if (comments.length >= 1){
        return true;
    }
    else {
        return false;
    }
}

// main function
facebookCommentDelete = (i) => {
    // handle an error box
    if (queryErrorCheck()){
        let r = document.querySelectorAll('[aria-label="OK"]');
        r[0].click();
        i = i + 1;
        setTimeout(() => {
            facebookCommentDelete(i);
        }, 5000)
    }
    if (commentsAvailable()){
        var myList = getList();
        myList[i].click();
        setTimeout(()=>{
            clik();  // click the delete button
        }, PAUSE);
        if (myList.length > 0){
            setTimeout(()=>{
                facebookCommentDelete(i); // recursive call
            }, PAUSE);
        }
        else{ console.log("erasure: attempting to retry in 3000 ms");
            setTimeout(()=>{
                facebookCommentDelete(i); // recursive call after waiting
            },RELOAD);
        }
    }
    else{ 
        console.log("Erasure completed, exiting.");
    }
}

// try starting at 0, if it doesn't work try a bigger number
facebookCommentDelete(0);
