var xmlHttp;

function srvTime(){
  try {
    //FF, Opera, Safari, Chrome
    xmlHttp = new XMLHttpRequest();
  }
  catch (err1) {
    //IE
    try {
      xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
    }
    catch (err2) {
      try {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
      }
      catch (eerr3) {
        //AJAX not supported, use CPU time.
        alert("AJAX not supported");
      }
    }
  }
  xmlHttp.open('HEAD','https://2do4school.nl',false);
  xmlHttp.setRequestHeader("Content-Type", "text/html");
  xmlHttp.send('');
  const st = xmlHttp.getResponseHeader("Date");
  return new Date(st);
}

export {srvTime};