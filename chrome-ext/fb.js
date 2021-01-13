var g = document.getElementsByClassName("sp_k2A2bGWLzV9_3x")
g[4].click();
$(".sp_d1AIRL-Hywn_3x").click()

const PAUSE = 2000;

clik = () => {
    let g = document.getElementsByClassName("sp_d1AIRL-Hywn_3x");
    g[0].click();
}

getList = () => {
    let g = document.getElementsByClassName("sp_k2A2bGWLzV9_3x");
    return g;
}

myfunc = () => {
    if (commentsAvailable()){
        var myList = getList();
        myList[5].click();
        setTimeout(()=>{
            clik();
        }, PAUSE);
        if (myList.length > 5){
            setTimeout(()=>{
                myfunc();
            }, PAUSE);
        }
        else{ console.log("erasure: attempting to retry in 1000 ms");
            setTimeout(()=>{
                myfunc();
            },PAUSE);
        }
    }
}


//check for available comments
commentsAvailable = () => {
    let comments = document.getElementsByClassName("sp_k2A2bGWLzV9_3x");
    if (comments.length > 6){
        return true;
    }
    else {
        return false;
    }
}
