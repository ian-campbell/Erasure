// this script is supposed to click the popup permissions checkbox
// doesn't work, the classes are correct though

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