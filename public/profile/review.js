var rev = {}
var tReview = document.querySelector('#tReview');
var val = document.querySelector('#val');
var subrev = document.querySelector('#subrev');

tReview.addEventListener('submit', (e) => {
    e.preventDefault()
    rev = {}
    var unid = `id` + Math.random((new Date()).getTime()).toString(16).slice(2);
    val.value = escapeInput(val.value)
    rev["id"] = unid;
    rev["name"] = userP.displayName;
    rev["value"] = val.value;
    subrev.click()
});

var updateNewReviews = document.querySelector("#updateNewReviews")
var reviewInpBg = document.querySelector("#reviewInpBg")

var writeRev = (key, userId, data) => {
    firebase.database().ref(`reviews/${key}/${userId}`).set(data).then(res => {
      snapRev(key, false);
      
      updateNewReviews.click()
      reviewInpBg.classList.add("hidden")
    })
}


var reviewUpdater = document.querySelector("#reviewUpdater");

var currentRev;
const snapRev = (key, bool, extra) => {
    var starCountRef;
    if (extra != undefined) {
      starCountRef = firebase.database().ref(`reviews/${key}/${extra}`)
    } else {   
      starCountRef = firebase.database().ref(`reviews/${key}`)
    }
  
  starCountRef.on('value', (snapshot) => {
      snapData = snapshot.val(); //an object
      currentRev = {};
    if (!(snapData === null)) {
      var addLogs = () => {
        for (const i in snapData) {
          if (Object.hasOwnProperty.call(snapData, i)) {
              currentRev[i] = snapData[i]
          }
        }
        return Promise.resolve("Success");
      }
      addLogs().then(() => {
          if (bool) {
            return currentRev;
          } else {
            getrevKeys(key);
          }
      })
    } else {
        // user not in db
      console.log('User not in db, should log you out');
    }
    })
}



var revKeys;
const getrevKeys = (key) => {
  var itemsKeys = firebase.database().ref(`reviews/${key}`);
  
  itemsKeys.on('value', (snapshot, prevChildKey) => {
    kvs = snapshot.val();
    if (!kvs) {
        console.log("no values in review db");
    } else {
        revKeys = {}
        revKeys = Object.keys(kvs);   
    }
  })
  return Promise.resolve('successfull')
}


storId = location.search.substring(1);

if (location.search.substring(1, 4) != "get") {
  getrevKeys(storId)
}

var reviews_main = document.querySelector("#reviews_main")
var reviews_pre = document.querySelector("#reviews_pre")

reviews_pre.addEventListener('click', () => {
  let ht = document.querySelector("body").scrollHeight;
  reviewUpdater.click()
  reviews_main.classList.toggle("hidden")
  reviews_pre.classList.add("hidden")
  window.scrollTo(0, ht+500)
})