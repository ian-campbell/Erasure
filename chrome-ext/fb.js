

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

myfunc = (i) => {
    if (queryErrorCheck()){
        let r = document.querySelectorAll('[aria-label="OK"]');
        r[0].click();
        i = i + 1;
        setTimeout(() => {
            myfunc(i);
        }, 5000)
    }
    if (commentsAvailable()){
        var myList = getList();
        myList[i].click();
        setTimeout(()=>{
            clik();
        }, PAUSE);
        if (myList.length > 0){
            setTimeout(()=>{
                myfunc(i);
            }, PAUSE);
        }
        else{ console.log("erasure: attempting to retry in 3000 ms");
            setTimeout(()=>{
                myfunc(i);
            },RELOAD);
        }
    }
    else{ 
        console.log("Erasure completed, exiting.");
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


// messenger unsend script
let p = document.getElementsByClassName("oajrlxb2 gs1a9yip g5ia77u1 mtkw9kbi tlpljxtp qensuy8j ppp5ayq2 goun2846 ccm00jje s44p3ltw mk2mc5f4 rt8b4zig n8ej3o3l agehan2d sk4xxmp2 rq0escxv nhd2j8a9 j83agx80 mg4g778l btwxx1t3 pfnyh3mw p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x tgvbjcpo hpfvmrgz jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso l9j0dhe7 i1ao9s8h esuyzwwr f1sip0of du4w35lb lzcic4wl abiwlrkh p8dawk7l mkd47r93 rgmg9uty");
p[p.length-2].click()
let x = document.getElementsByClassName("p1ueia1e pgctjfs5 l8rlqa9s sh06z9xi i2p6rm4e");
x[2].click()
let r = document.querySelectorAll('[aria-label="Remove message"]');
r[0].click();
let y = document.querySelectorAll("[aria-label='Remove']");
y[0].click()
// x