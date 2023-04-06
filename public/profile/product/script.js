// auth state change
var userP, owner, link;
const urlMain = location.search.substring(1)
if (urlMain.includes('%2C')){
  link = urlMain.split("%2C");
}else if (urlMain.includes(',')){
  link = urlMain.split(",");
}else{
  link = urlMain.split(",");
}

if (link.length >= 2) {
  owner = link[1]
} else {
  owner = link[0]
}  

var refferer;
if (link[2]) {
  refferer = link[2]
} else {
  refferer = owner
}
console.log("refferer", refferer);

auth.onAuthStateChanged(user => {
    if (user) {
      userP = user;
      setCookie("uid", user.uid)
      checkUserProd()
      getKeyVals(owner)
      getcartVals(userP.uid);
      snapLoc(owner)
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
  var plan_life;
  var uniq = `id${parseInt(totalProductSelling) + 1}` + Math.random((new Date()).getTime()).toString(16).slice(2)

  firebase.database().ref(`users/${userP.uid}/`).on('value', (snapshot) => {
    let snapData = snapshot.val();
    plan_life = snapData.life
  })
    
  if (!file) return alert("Cannot continue without an image upload")
  
    for (const i of updEditable) {
      newContent[i.title] = escapeInput(i.innerText);
    }
  
    if(newContent["itm_name"] == "Product Name") return alert("Add the Name of the Products you're Selling")
    // if (newContent["itm_price"] == 5000) return alert("How much are you willing to sale this item for")
    if (newContent["letter"] == "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias at aliquid repellat, esse autem doloribus quo nihil voluptatibus suscipit sint iure facere") return alert("Add a Little description about what you sale")
  
    newContent["alt"] = "stor.com.ng-" + profileImgInp.files[0].name
    newContent["count"] = 1
    newContent["store_location"] = currentLoc.store_location
  
  
  if ((totalProductSelling == 5) && (plan_life != true)) {
    document.querySelector("#updMainID").classList.add("hidden")
    document.querySelector("#updPriceOffer").classList.remove("hidden")
    alert("Buy a LifeTime Plan To add More Products to your Dashboard, Refresh Page if this won't be the best Time to Buy")
  } else {
    uploadNew(file, uniq, newContent)
  }
})


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
            console.log("currentLoc", currentLoc.store_name)
            
            console.log("currentLoc", currentLoc.store_location)
            
            // update store name
            document.querySelector('#getDataLoadEnd').click()
          }
      })
    } else {
        // user not in db
      console.log('User not in db, should log you out');
    }
  })
  
  return Promise.resolve("success")
}



// edit in products
var edtThis = document.querySelector("#edtThis")

edtThis.addEventListener('click',()=> edtInDb())

var edtUniq
const edtInDb = () =>{
  // e.preventDefault();
  const newContentEdt = {};
  var profileImgInpEdt = document.querySelector('#profileImgInpEdt');
  var updEditer = document.querySelectorAll('#updEditer');
  
  var file = profileImgInpEdt.files[0];
  
  if(!edtUniq) return alert("Cannot continue without a Unique Id")
  
  for (const i of updEditer) {
    newContentEdt[i.title] = escapeInput(i.innerText);
  }
  
  
  if (!file) return updateUserData(userP.uid, edtUniq, newContentEdt)
  
    newContentEdt["alt"] = "stor.com.ng-" + profileImgInpEdt.files[0].name
    newContentEdt["count"] = 1
    
    uploadNew(file, edtUniq, newContentEdt)
}

var uploadPop = document.querySelector("#uploadPop");

var uploadNew = (file, key, object) => {
    var metadata = {
      contentType: 'image/jpeg'
    };
    // delete pre images to utilize db
    preDel(key)
          
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
    
  preImage.listAll()
    .then((res) => {
      res.items.forEach((itemRef) => {
        itemRef.delete().then(() => {
          console.log("deleted succesfully");
        }).catch((error) => {
          console.log("err", error);
        }); 
      });
    }).catch((error) => {
      console.log("err", error);
    });
  
  return Promise.resolve('Successfull')
}



// write user to database editable to scale
const writeUserData = (userId, key, data, ref) => {
  firebase.database().ref(`store/${userId}/${key}`).set(data).then(res => {
    snap(userId, key);
  })
}

// Update user in database, editable to scale
const updateUserData = (userId, key, data, ref) => {
  firebase.database().ref(`store/${userId}/${key}`).update(data).then(res => {
    snap(userId, key);
  })
}

const writetest = () => {
  data = {}
  data['name'] = "Franklin"
  data['slog'] = "killer"
  data['tag_line'] = "there's Limits"
  firebase.database().ref(`tests/${userP.uid}`).set(data).then(res => {
    console.log("written");
  })
}
const updtest = () => {
  data = {}
  data['tag_line'] = "No Limits Allall"
  firebase.database().ref(`tests/${userP.uid}`).update(data).then(res => {
    console.log("updated");
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
            // if (allAvl.includes(snapData.id)) {
              if (Object.hasOwnProperty.call(snapData, i)) {
                cartCurrent[i] = snapData[i]
               }
            // } else {
              // getcartVals(userP.uid);
              // return console.log("SHould clear cart item with", snapData.id);
              // removeCartItm(snapData.id)
            // }
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
  if (location.search.substring(1).includes(userP.uid)) { 
    var remover = firebase.database().ref(`store/${userP.uid}/${ref}`);
    // remove file from storage
    preDel(ref)
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
  inCartPay = []
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
  return Promise.resolve("Success")
}
getAllSub(owner)







// pay with paystack
var inCartPay = []
var payBtnForm = document.querySelector('#payBtnForm');
var payAdCont = document.querySelector('#payAdCont');
var payAdContInput = payAdCont.querySelectorAll('input');
var payAdContSelect = payAdCont.querySelector('select');



payBtnForm.addEventListener('submit', (e) => {
  e.preventDefault()
  var address =   `${payAdContInput[0].value}, ${payAdContSelect.value} State. ${payAdContInput[1].value}`
  var phone = payAdContInput[2].value
  
  const getOtherData = () => {
    firebase.database().ref(`users/${userP.uid}/`).on('value', (snapshot) => {
      let snapData = snapshot.val(); //an object
      
      p_img = snapData.profile_img.substring(0, 76) + snapData.profile_img.substring(76).replaceAll("/", "%2F");
      
      upline = snapData.upLine
      
      callTogether(p_img, upline)
    })
  }
  
  const callTogether = (p_img, upline) => {
    inCartPay.forEach(i => {
      i["p_name"] = userP.displayName;
      i["email"] = userP.email;  
      i["address"] = address;
      i["p_phone"] = phone;  
      i["p_img"] = p_img;  
      i["upline"] = upline;  
      i["refferer"] = refferer  
      i["date"] = Date.now();  
    })
    var currentTotal = 0;
    inCartPay.forEach(i => {
      currentTotal += (parseInt(i.itm_price) * parseInt(i.count))
    })
    payWithPaystack(currentTotal)  
  }
  
  getOtherData()
  
  function payWithPaystack(amt) {
    let handler = PaystackPop.setup({
      key: 'pk_live_bdaedf9d29d5f6fbc1af4b369cf705b9b10a4076', // Replace with your public key
      email: userP.email,
      amount: (amt + (amt*.03)) * 100,
      ref: ''+Math.floor((Math.random() * 1000000000) + 1), 
      onClose: function () {        
      },
      callback: function(response){
        inCartPay.forEach(i => {
          // to shop orders
          writeOnPayComplete(i.store_uid, i.id, i, "orders")
          
          // to buyer paid
          writeOnPayComplete(userP.uid, i.id, i, "paid")
          
          let prcnt = ((i.itm_price * i.count) * 10) / 100;
          
          console.log("i.upline", i.upline);
          
          if (i.upline) {
            toAffiliate(i.upline, prcnt, "sales")
          }
          
          // remove from cart
          removeCartItm(i.id)
        })
        // assign to ordered and print completed
        location.assign(`https://ipods.stor.com.ng/sold?${userP.email}`)
        
        let message = 'Payment complete! Reference: ' + response.reference;
        // alert(message, "An invitation Mail will to sent to Your Email Address");
      }
    });
  
    handler.openIframe();
  }
})


// add to dashboard/paid/id/key -- buyers paid
function payForLife(amt) {
    let handler = PaystackPop.setup({
      key: 'pk_live_bdaedf9d29d5f6fbc1af4b369cf705b9b10a4076', // Replace with your public key
      email: userP.email,
      amount: (amt) * 100,
      ref: ''+Math.floor((Math.random() * 1000000000) + 1), 
      onClose: function () {
      },
      callback: function (response) {
        myPlan = {}
        myPlan["life"] = true
        
        // to plans
        firebase.database().ref(`users/${userP.uid}/`).update(myPlan)
          
        
        let message = 'Payment complete! Reference: ' + response.reference;
        
        
        alert(message, "Payment Succesfull, reload Page and Start adding more Products");
      }
    });
  
    handler.openIframe();
}




// add to dashboard/orders/id/key -- sellers orders
// add to dashboard/paid/id/key -- buyers paid


// write user to database editable to scale
const writeOnPayComplete = (shopId, key, data, ref) => {
  key += ("_" + Math.floor((Math.random() * 100000) + 1))
  firebase.database().ref(`dashboard/${ref}/${shopId}/${key}`).set(data).then(res => {
    console.log(`Written ${data} to Shop with id ${shopId}`);
  })
} 


// sales
// count on auth file

// write to affiliate "sales"
const toAffiliate = (upline, data, ref) => {
  var affsValCount
  
  firebase.database().ref(`affiliate/${ref}/${upline}`).once('value').then((snapshot) => {
    affs = snapshot.val()
    
    if (!affs) {
      affsValCount = 0
    } else {
      affsKeys = Object.keys(affs)
      affsValCount = affsKeys.length  
    }
    
    
    firebase.database().ref(`affiliate/${ref}/${upline}/${parseInt(affsValCount) + 1}`).set(data).then(res => {
      console.log(`Written ${data} to Shop with id ${upline}`);
    })
  }) 
}


// check if image is Valid

function imageExists(imgMain, id) {
  
  var img = new Image();
  img.onload = function() { console.log("this image exists", true); };
  img.onerror = function () {
    removeCartItm(id)
    console.log("Dont exists " + false + " Deleted " + id+ " from cart");
  };
  img.src = imgMain;
}
