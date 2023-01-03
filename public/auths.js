const firebaseConfig = {
  apiKey: "AIzaSyB2aeCFljZl67dhxCy-Wg3i1ZCxwyYQkWs",
  authDomain: "stor-com-ng.firebaseapp.com",
  databaseURL: "https://stor-com-ng-default-rtdb.firebaseio.com",
  projectId: "stor-com-ng",
  storageBucket: "stor-com-ng.appspot.com",
  messagingSenderId: "779007788844",
  appId: "1:779007788844:web:051d4a7725c2b2aea84e89",
  measurementId: "G-7ENF86QVH8"
};

firebase.initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);

    const provider = new firebase.auth.GoogleAuthProvider();
  
  const auth = firebase.auth()
  var database = firebase.database()
  
  const storage = firebase.storage()
  const storageRef = storage.ref()  
  
  
// get info funx
var inpValues;

const getInfo = (a) => {
    var emails = a.querySelectorAll('input');
    
    inpValues = []; 
    var obj = {}
    
    for (const i of emails) {
        if (i.name && i.value) {
            obj[i.name] = i.value;
        }
    }
    inpValues.push(obj);
    return inpValues
}



function setCookie(cname, cvalue) {
  const d = new Date();
  d.setTime(d.getTime() + (7*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}




function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      console.log("cooks "+ name +" Deleted");
    }
}

function escapeInput(input) {
  return String(input)
    .replace(/&/g, '')
    .replace(/"/g, '')
    // .replace(/'/g, "'")
    .replace(/</g, '')
    .replace(/>/g, '');  
}

// pop in out funx
var popInOut = (ele) => {
  ele.classList.remove("hidden")
    setTimeout(() => {
      ele.classList.add("hidden")
    }, 5000);
}