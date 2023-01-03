// auth state change
var userP, owner;
var link = location.search.substring(1).split(",");
if (link.length >= 2) {
  owner = link[1]
} else {
  owner = link[0];
}  
auth.onAuthStateChanged(user => {
    if (user) {
      userP = user;
      setCookie("uid", user.uid)
      checkUserProd()
      getKeyVals(owner)
      getcartVals(userP.uid);
  } else {
      console.log('User is logged out!')
      location.assign(`../../auth?redirect=${location.href}`)
  }
})

var updwithLink = document.querySelector("#updwithLink");
var newProductAdd = document.querySelector("#newProductAdd");
var customerStat = document.querySelector("#customerStat");

// hide waterAds to all execpt owner
var waterAds = document.querySelector('#waterAds');


const checkUserProd = () => {
  if (userP.uid != owner) {
    newProductAdd.classList.add("hidden")
    customerStat.classList.remove("hidden")
    waterAds.classList.add("hidden")
  } else {
    newProductAdd.classList.remove("hidden")
    customerStat.classList.add("hidden")
    waterAds.classList.remove("hidden")
  }
}

// store data to db
var updEditable = document.querySelectorAll('#updEditable');
var addToStore = document.querySelector('#addToStore');
var profileImgInp = document.querySelector('#profileImgInp');


for (const i of updEditable) {
    i.setAttribute("contenteditable", "true");
}


var newContent = {};
var totalProductSelling;
addToStore.addEventListener('click', (e) => {
    e.preventDefault();
    var file = profileImgInp.files[0];
    var uniq = `id${parseInt(totalProductSelling)+1}` + Math.random((new Date()).getTime()).toString(16).slice(2);
    
    if(!file) return alert("Cannot continue without an image upload")
    for (const i of updEditable) {
      newContent[i.title] = escapeInput(i.innerText);
    }
    newContent["alt"] = "stor.com.ng-" + profileImgInp.files[0].name
    newContent["count"] = 1
  // return console.log("newContent", newContent);
    uploadNew(file, uniq, newContent)
})

var uploadPop = document.querySelector("#uploadPop");

var uploadNew = (file, key, object) => {
    var metadata = {
      contentType: 'image/jpeg'
    };
        // return preDel(key)
          
      var uploadTask = storageRef.child(`images/${userP.uid}/store/${key}/` + file.name).put(file, metadata);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
            
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log('Upload is paused');
            break;
                
          case firebase.storage.TaskState.RUNNING:
            console.log('Upload is running');
            break;
        }
      }, (error) => {
        switch (error.code) {
          case 'storage/unauthorized':
            console.log("err unauthorized");
            break;
                
          case 'storage/canceled':
            console.log("err canceled by user");
            break;
                
          case 'storage/unknown':
            console.log("err storage unknown");
            break;
        }
      }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          object["id"] = key;
          object["img"] = downloadURL;
          writeUserData(userP.uid, key, object); 
          popInOut(uploadPop);
        });
      }
    );
}


// delete previous img storage 
const preDel = (key) => {
  preImage = storageRef.child(`images/${userP.uid}/store/${key}/`)
    
    if(preImage) console.log(preImage);
    
    // preImage.delete().then(() => {
    //     console.log("deleted succesfully");
    //   }).catch((error) => {
    //     console.log("err", error);
    //   });
}



// write user to database editable to scale
const writeUserData = (userId, key, data, ref) => {
  firebase.database().ref(`store/${userId}/${key}`).set(data).then(res => {
    snap(userId, key);
  })
}


var cartPop = document.querySelector("#cartPop");

// write user to database editable to scale
const writeUserCart = (userId, key, data) => {
  firebase.database().ref(`cart/${userId}/${key}`).set(data).then(res => {
    snapCart(userId, key, false);
    popInOut(cartPop);
  })
}



// get stor value from db by id and key
var current;
const snap = (id, key, bool) => {
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
            getKeyVals(owner)
          }
      })
    } else {
        // user not in db
      console.log('User not in db, should log you out');
    }
  })
}

var allAvl
const checkAvailiables = (storeId, itmId) => {
  var storeCheck = firebase.database().ref(`store/${storeId}`)
  
  storeCheck.on("value", (val) => {
    values = val.val()
    if(values) allAvl = Object.keys(values)
  })
}


checkAvailiables(owner)


var cartCurrent;
const snapCart = (id, key, bool) => {
  
  var starCountRef = firebase.database().ref(`cart/${id}/${key}`)
  
  starCountRef.on('value', (snapshot) => {
      snapData = snapshot.val(); //an object
      cartCurrent = {};
    if (!(snapData === null)) {
      var addLogs = () => {
        if (kVal) {
          for (const i in snapData) {
            if (allAvl.includes(snapData.id)) {
              if (Object.hasOwnProperty.call(snapData, i)) {
                cartCurrent[i] = snapData[i]
               }
            } else {
              removeCartItm(snapData.id)
            }
          }
        } else {
          for (const i in snapData) {
            if (Object.hasOwnProperty.call(snapData, i)) {
                cartCurrent[i] = snapData[i]
            }
          }
        }
        return Promise.resolve("Success");
      }
      addLogs().then(() => {
        if (bool) {
            return cartCurrent;
          } else {
            getcartVals(userP.uid)
          }
      })
    } else {
        // user not in db
      console.log('Nothing in cart');
    }
  })
}


// get all stor keys
var valuesUpdater = document.querySelector("#valuesUpdater");
var cartValUpdater = document.querySelector("#cartValUpdater");
var noProductBg = document.querySelector("#noProductBg");
var cartValUpdated = document.querySelector("#cartValUpdated");
var stgtHidder = document.querySelector("#stgtHidder");

var kVal;
const getKeyVals = (x) => {
  var itemsKeys = firebase.database().ref(`store/${x}`);
  
  itemsKeys.on('value', (snapshot, prevChildKey) => {
    kvs = snapshot.val();
    stgtHidder.classList.add("hidden")
    if (!kvs) {
      noProductBg.classList.remove("hidden")
      totalProductSelling = 0;
      console.log("Shop has no products");
    } else {
      kVal = {}
      noProductBg.classList.add("hidden")
      kVal = Object.keys(kvs);
      totalProductSelling = kVal.length;
      valuesUpdater.click();
    }
  });
}

var cartVal;
const getcartVals = (x) => {  
  var itemsKeys = firebase.database().ref(`cart/${x}`);
  
  itemsKeys.on('value', (snapshot, prevChildKey) => {
    kvs = snapshot.val();
    cartVal = {}
    if (!kvs) {
      console.log("no itmes in cart");
      cartVal = [];
      cartValUpdater.click();
    } else {
      cartVal = Object.keys(kvs);
      cartValUpdater.click();
      // if (link.length >= 2) updwithLink.click()
    }
  });
}

// delete products from store
var removeProducts = (ref) => {
  if (location.search.substring(1) == userP.uid) { 
    var remover = firebase.database().ref(`store/${userP.uid}/${ref}`);
    remover.remove(() => {
      getKeyVals(userP.uid);
      console.log(ref, "should be removed")
    });
  }else{
    alert("You're not the Store owner How the Hell did you get here")
  }
}

// delete from cart
var removeCartItm = (ref) => {
  var remover = firebase.database().ref(`cart/${userP.uid}/${ref}`);
  remover.remove(() => {
    getcartVals(userP.uid);
  }); 
}


// add subscribers
var subsValCount = 0
var subsVal = []

var subcmplt = document.querySelector("#subcmplt")

var subMe = (shopId) => {
  getAllSub(shopId).then(() => {
    if(subsVal.includes(userP.email)){
        console.log("Email already Exists, You can add a different one")
      }else{
        firebase.database().ref(`stor_subs/${shopId}/${parseInt(subsValCount) + 1}`).set(userP.email).then(res => {
          popInOut(subcmplt);
          console.log("added to db");
        })
      }
  })
}

const getAllSub = (shopId) => {
  console.log("shopId", shopId);
  var itemsKeys = firebase.database().ref(`stor_subs/${shopId}`);
  itemsKeys.on('value', (snapshot, prevChildKey) => {
    subs = snapshot.val()
    subsVal = []
    if (!subs) {
      console.log("No subscribers");
    } else {
      subsKeys = Object.keys(subs)
      subsValCount = subsKeys.length  
      subsVal = Object.values(subs)
    }
  });
  return Promise.resolve("sucessfull")
}
getAllSub(owner)


