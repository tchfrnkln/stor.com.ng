var kVal;
const getKeyVals = () => {
  var itemsKeys = firebase.database().ref(`store/`);
  
  itemsKeys.on('value', (snapshot, prevChildKey) => {
    kvs = snapshot.val();
    if (!kvs) {
      console.log("No Products Found")
    } else {
        kVal = {}
        kVal = Object.keys(kvs)
        kVal.forEach(i => {
            getKeyVals2(i)
        })
    }
  });
}


getKeyVals()


var kVal2
const getKeyVals2 = (x) => {
  var itemsKeys = firebase.database().ref(`store/${x}`);
  
  itemsKeys.on('value', (snapshot, prevChildKey) => {
    kvs = snapshot.val();
    if (!kvs) {
      console.log("No Products Found")
    } else {
        kVal2 = Object.keys(kvs)
        kVal2.forEach(i => {
            snap(x, i)
        })
    }
  });
}



var allToday = []



// get stor value from db by id and key
const snap = (id, key, bool) => {
    var current;
    var starCountRef = firebase.database().ref(`store/${id}/${key}`)
  
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
            allToday.push(current)
          }
      })
    } else {
        // user not in db
      console.log('User not in db, should log you out');
    }
  })
}


// get users value from db by id and key
var currentLoc;
const snapLoc = (id, bool) => {
  var starCountRef = firebase.database().ref(`users/${id}`)
  
  starCountRef.on('value', (snapshot) => {
      snapData = snapshot.val(); //an object
      currentLoc = {};
    if (!(snapData === null)) {
      var addLogs = () => {
        for (const i in snapData) {
          if (Object.hasOwnProperty.call(snapData, i)) {
              currentLoc[i] = snapData[i]
          }
        }
        return Promise.resolve("Success");
      }
      addLogs().then(() => {
          if (bool) {
            return currentLoc
          } else {
              console.log("currentLoc", currentLoc.store_location)
          }
      })
    } else {
        // user not in db
      console.log('User not in db, should log you out');
    }
  })
  
  return Promise.resolve("success")
}


var spilt_loaders = document.querySelector('#spilt_loaders')


var chAllTd = setInterval(() => {
    if (allToday.length >= 1) {
      console.log("working")
      spilt_loaders.classList.add("hidden")
      clearInterval(chAllTd)      
      document.querySelector('#showAll').click()
    } else {
        console.log("not yet")
    }
}, 1000)




// big bg highlight on click

// var allSales;
// const SellingNow = () => {
//   setTimeout(() => {
//     allSales = document.querySelectorAll('.SellingNow')
//     console.log(allSales);
//     allSales.forEach(i => {
//       i.addEventListener("dblclick", () => {
//           console.log(i.src);
//         })
//     })
//   }, 1000);
  
//   // i.mouseup(()=>{
//   //   clearTimeout(pressTimer);
//   //   return false;
//   // }).mousedown(()=>{
//   // pressTimer = window.setTimeout(() => {
//   //   console.log(i.childNodes[1].childNodes[1].src)
//   // }, 1000);
//   // return false;
//   // })
// }




      var counter = document.getElementById("counter");
      var count = 0;
      var timer = setInterval(function() {
        count++;
        counter.innerHTML = count;
        if (count === 100) {
          clearInterval(timer)
          counter.parentElement.classList.add("hidden")
        }
      }, 5);


// show more products when scroll to bottom

// if (window.scrollHeight - window.scrollTop() == window.height())
//       {
//           alert('Reached the bottom!');
//       }