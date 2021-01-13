

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


const PAUSE = 500;
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

getList = () => {
    var n = document.querySelectorAll('[aria-label="Action options"]');
    return n;
}

myfunc = () => {
    if (commentsAvailable()){
        var myList = getList();
        myList[0].click();
        setTimeout(()=>{
            clik();
        }, PAUSE);
        if (myList.length > 0){
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
    let comments = document.querySelectorAll('[aria-label="Action options"]');
    if (comments.length >= 1){
        return true;
    }
    else {
        return false;
    }
}
