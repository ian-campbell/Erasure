var g = document.getElementsByClassName("sp_k2A2bGWLzV9_3x")
g[15].click();
$(".sp_d1AIRL-Hywn_3x").click()

clik = () => {
    $(".sp_d1AIRL-Hywn_3x").click();
}

myfunc = (data, myfunc2) => {
    var myList = data;
    for (var i=15; i < myList.length; i++) {
        myList[i].click()
        setTimeout(myfunc2, 1000); 
    }
}


