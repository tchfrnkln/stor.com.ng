// auth state change
var userP, owner;
owner = location.search.substring(1);

auth.onAuthStateChanged(user => {
    if (user) {
      userP = user;
      getOrderVals(userP.uid)
      // getDlVals(userP.uid)
      snapStlmnt(userP.uid)
  } else {
      console.log('User is logged out!')
      location.assign(`../../auth?redirect=${location.href}`)
  }
})

// dashboard/orders/id/key
// dashboard/delivered/id/key



var orderValUpdater = document.querySelector('#orderValUpdater')
var dlValUpdater = document.querySelector('#dlValUpdater')


var orderVal;
const getOrderVals = (x) => {  
  var itemsKeys = firebase.database().ref(`dashboard/orders/${x}`);
  
  itemsKeys.on('value', (snapshot, prevChildKey) => {
    kvs = snapshot.val();
    orderVal = {}
    if (!kvs) {
      console.log("no itmes in Orders");
      orderVal = [];
      orderValUpdater.click();
    } else {
      orderVal = Object.keys(kvs)
      orderValUpdater.click();
    }
  });
}

var dlVal;
const getDlVals = (x) => {  
  var itemsKeys = firebase.database().ref(`dashboard/delivered/${x}`);
  
  itemsKeys.on('value', (snapshot, prevChildKey) => {
    kvs = snapshot.val();
    dlVal = {}
    if (!kvs) {
      console.log("no itmes in cart");
      dlVal = [];
      dlValUpdater.click();
    } else {
      dlVal = Object.keys(kvs);
      dlValUpdater.click();
    }
  });
}



// get stor value from db by id and key
var current;
const snap = (branch, id, key, bool) => {
  var starCountRef = firebase.database().ref(`dashboard/${branch}/${id}/${key}`)
  
  starCountRef.on('value', (snapshot) => {
      snapData = snapshot.val(); //an object
      current = {};
    if (!(snapData === null)) {
      var addLogs = () => {
        for (const i in snapData) {
          if (Object.hasOwnProperty.call(snapData, i)) {
              current[i] = snapData[i]
          }
        }
        return Promise.resolve("Success");
      }
      addLogs().then(() => {
        if (bool) {
            return current;
          } else {
            console.log("current", current);
        }
      })
    } else {
        // user not in db
      console.log('User not in db, should log you out for '+ key);
    }
  })
  
}




// removing dashboard/orders/id/key
const removeRef = (branch, key) => {
  var remover = firebase.database().ref(`dashboard/${branch}/${userP.uid}/${key}`);
    remover.remove(() => {
      console.log(key, "should be removed")
    });
  return Promise.resolve("success")
}
    



// write user to database editable to scale
const writeOnPayComplete = (shopId, key, data, ref) => {
  key += ("_" + Math.floor((Math.random() * 100000) + 1))
  firebase.database().ref(`dashboard/${ref}/${shopId}/${key}`).set(data).then(res => {
    console.log(`Written ${data} to Shop with id ${shopId}`);
  })
}


var stlUpdBtnMain = document.querySelector('#stlUpdBtnMain');
var accNum = document.querySelector('accnum');

var stlDetscr = document.querySelectorAll("#stlDet")



stlUpdBtnMain.addEventListener('click', () => {
  accNum.innerText = esapeOnlyNum(accNum.innerHTML);

  let oj = {}
  
  stlDetscr.forEach(i => {
    oj[i.title] = i.innerHTML;
  })
  
  writeStlmnt(userP.uid, oj)
})

// settlement/id/obj




// write user to database editable to scale
const writeStlmnt = (shopId, data) => {
  firebase.database().ref(`settlement/${shopId}`).set(data).then(() => {
    console.log(`Written Settlements to Shop with id ${shopId}`);
  })
}


// get stor value from db by id and key
var currentStlmnt;
const snapStlmnt = (id, bool) => {
  var starCountRef = firebase.database().ref(`settlement/${id}`)
  
  starCountRef.on('value', (snapshot) => {
      snapData = snapshot.val(); //an object
      currentStlmnt = {};
    if (!(snapData === null)) {
      var addLogs = () => {
        for (const i in snapData) {
          if (Object.hasOwnProperty.call(snapData, i)) {
              currentStlmnt[i] = snapData[i]
          }
        }
        return Promise.resolve("Success");
      }
      addLogs().then(() => {
        if (bool) {
            return currentStlmnt;
        } else {
            getStlmnt.click()
        }
      })
    } else {
        // user not in db
      console.log('User not in db, should log you out for '+ id);
    }
  })
}

var getStlmnt = document.querySelector("#getStlmnt")


// see all delivered btn

var allDlvbtn = document.querySelector("#allDlvbtn")

allDlvbtn.addEventListener('click', () => {
  getDlVals(userP.uid)
})