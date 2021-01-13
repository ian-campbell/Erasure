var g = document.getElementsByClassName("sp_k2A2bGWLzV9_3x")
g[15].click();
$(".sp_d1AIRL-Hywn_3x").click()

clik = () => {
    $(".sp_d1AIRL-Hywn_3x").click();
}

myfunc = (data) => {
    var myList = data;
    for (var i=15; i < myList.length; i++) {
        myList[i].click()
        setTimeout($(".sp_d1AIRL-Hywn_3x").click(), 1000); 
    }
}


