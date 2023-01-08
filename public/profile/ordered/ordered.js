// auth state change
var userP, owner;
owner = location.search.substring(1);

auth.onAuthStateChanged(user => {
    if (user) {
      userP = user;
      getOrderVals(userP.uid)
  } else {
      console.log('User is logged out!')
      location.assign(`../../auth?redirect=${location.href}`)
  }
})


// dashboard/paid/id/key



var orderValUpdater = document.querySelector('#orderValUpdater')


var orderVal;
const getOrderVals = (x) => {  
  var itemsKeys = firebase.database().ref(`dashboard/paid/${x}`);
  
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



