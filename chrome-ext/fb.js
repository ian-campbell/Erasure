

var m = document.querySelectorAll('[aria-label="Action options"]');
m[0].click();
var s = document.querySelectorAll('[data-pagelet="root"]');
s[2].getElementsByTagName('i')[0].click()



var t = Array.from(document.querySelectorAll('div'))
  .find(el => el.textContent === 'Activity Log');


sortByComments = () => {

    let h = document.getElementsByClassName('emxnvquj ni8dbmo4 tr9rh885 ciko2aqh');
    let n = h[0].querySelectorAll('*[data-visualcompletion]');
    let a = n[20];
    let v = a.querySelectorAll("[class='bp9cbjyn j83agx80 btwxx1t3']");
    v[0].click();
    let save = document.querySelectorAll("[aria-label='Save Changes']");
    save[0].click();
}

openFilter = () => {
    var b = document.getElementsByClassName('j83agx80 pfnyh3mw');
    b[23].firstElementChild.click();
    setTimeout(() =>{
        sortByComments();
    }, 8000)
}


const PAUSE = 1000;
var starter = document.getElementsByClassName('sp_ImHyMYe7JWT_3x');
clik = () => {
    let g = document.getElementsByClassName("sp_d1AIRL-Hywn_3x");
    g[0].click();
}

getList = () => {
    let n = document.getElementsByClassName("sp_k2A2bGWLzV9_3x");
    return n;
}

myfunc = () => {
    if (commentsAvailable()){
        var myList = getList();
        myList[4].click();
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
    if (comments.length > 5){
        return true;
    }
    else {
        return false;
    }
}
