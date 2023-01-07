var updateAll = document.querySelector("#updateAll")
var userP
auth.onAuthStateChanged(user => {
  if (user) {
    userP = user;
    console.log(user.email + " is logged in!");
    checkUser()
  } else {
    if (sessionStorage.getItem("loggedOutANaccount") != "true") {
      console.log('User is logged out!')
      deleteAllCookies().then(() => {
        location.assign('../auth?redirect=' + location.href)
      })
    } else {
      console.log("Just logging out! wait");
    }
  }
})



// delete cokkies function
var deleteAllCookies = () => {
    document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
  
    return Promise.resolve("All cookies cleared");
}

const logOut = document.querySelector('#logOut')

logOut.addEventListener('click', () => {
  sessionStorage.setItem("loggedOutANaccount", true)
  firebase.auth().signOut().then(() => {
    deleteAllCookies().then(() => {
      location.assign('../auth')
    })
  }).catch((error) => {
    alert("Error while logging out, check network connection and try again")
  });
})

// if no cookies logout
if (!getCookie('store_name') && getCookie('profile_img_pre') && getCookie('profile_img')) {
  logOut.click()
}


// add content editable to values
const addContentEdit = document.querySelectorAll('#addContentEdit');
const addContentEditBtn = document.querySelector('#addContentEditBtn');
var profileImg = document.querySelector('#profileImg');
var profileImgInp = document.querySelector('#profileImgInp');
var copyProfileUrlbtn = document.querySelector('#copyProfileUrlbtn');
var contentEditBtnUpdate = document.querySelector('#contentEditBtnUpdate');
var cancelEdit = document.querySelector('#cancelEdit');
var reviewBtn = document.querySelector('#reviewBtn');
var cEditStart = document.querySelector('#cEditStart');


// content edit base
addContentEditBtn.addEventListener('click', (e) => {
  e.preventDefault()
  addContentEditBtn.classList.add("hidden")
  popInOut(cEditStart)
  
  // loop through and set attr + addlisteners to all values
  for (const i of addContentEdit) {
    i.setAttribute("contenteditable", "true");
    i.addEventListener('input', () => {
      // excape while registering in server server
      // console.log(`${i.title} = ${i.innerText}`);
    })
    contentEditBtnUpdate.classList.remove('hidden')
    cancelEdit.classList.remove('hidden')
    reviewBtn.classList.add('hidden')
  }
  // profile click, auto click input image
  profileImg.addEventListener('click', () => {
    copyProfileUrlbtn.classList.add("hidden");
    profileImgInp.click();
  })
})

var profile;
// get user from db by x and reload page
const snap = (x, bool) => {
  var starCountRef = firebase.database().ref(`users/${x}/`)
  starCountRef.on('value', (snapshot) => {
    snapData = snapshot.val(); //an object
    if (!(snapData === null)) {
      setCookie("was_updated", true)
      profile = {}
      var addLogCookies = () => {
        for (const key in snapData) {
          if (Object.hasOwnProperty.call(snapData, key)) {
            setCookie(key, snapData[key])
            if(bool) sessionStorage.setItem(key, snapData[key])
            profile[key] = snapData[key]
          }
        }
        return Promise.resolve("Success");
      }
      addLogCookies().then(() => {
        if (bool) {
          sessionStorage.setItem("updHere", "true")
          // return updateAll.click()
          location.assign(location.origin+location.pathname+`?`+location.search.substring(5))
        }
        // updateProfileAfter();
      })
    } else {
        // user not in db
      console.log('User not in db, should log you out');
      prompt("There's a problem with This Store Link Crosscheck and Verify")
      }
    })
}

// call updates
if(location.search.substring(1,5) == "get=") snap(location.search.substring(5), true);

const updateProfileAfter = () => {
  location.reload()
}

var contentEditcmplt = document.querySelector("#contentEditcmplt")

// update user data
function userUpdate(userId, data) {
  popInOut(contentEditcmplt)
  var updates = {};
  updates[`/users/${userId}`] = data;
  firebase.database().ref().update(updates).then(() => {
    snap(userId);
  }).then(() => {
    locReload()
  })
}

var locReload = () => {
  loc = location.href.split("?");
  location.assign(loc[0]+"?get="+loc[1])
}

// write user to database editable to scale
function writeUserData(userId, data) {
    popInOut(contentEditcmplt)
    firebase.database().ref(`users/${userId}`).set(data).then(res => {
      snap(userId);
    }).then(() => {
      locReload()
    })
}

// hide waterAds to all except owner
var waterAds = document.querySelector('#waterAds');


const checkUser = () => {
  if (userP.uid != location.search.substring(1)) {
    addContentEditBtn.classList.add("hidden");
    waterAds.classList.add("hidden");
  } else {
    waterAds.classList.remove("hidden");
    // Update all data Inputed
    contentEditBtnUpdate.addEventListener('click', (e) => {
      e.preventDefault()
      
      var objStor = {}
      for (const i of addContentEdit) {
        objStor[i.title] = escapeInput(i.innerText);
      }
      
      var metadata = {
        contentType: 'image/jpeg'
      };
      var file;
      var was_updated = getCookie("was_updated");
      if ((was_updated === true) && (!profileImgInp.files[0])) {
        objStor["profile_img"] = getCookie("profile_img")
        userUpdate(userP.uid, objStor)
      } else {
        if (!profileImgInp.files[0]) {
          objStor["profile_img"] = getCookie("profile_img")
          userUpdate(userP.uid, objStor);
        } else {
          file = profileImgInp.files[0]
    
          // Create a reference to the file to delete
          // var preFiledb = storageRef.child(`images/${userP.uid}/profile_img/${getCookie("profile_img").split("/").pop().split("?")[0]}`)
    
          // // Delete the file
          // preFiledb.delete().then(() => {
          //   console.log("deleted succesfully");
          // }).catch((error) => {
          //   console.log("err", error);
          // });

          // Create a reference to the file to delete
          var preFiledb = storageRef.child(`images/${userP.uid}/profile_img/`)
    
          // Delete the file
          preFiledb.listAll()
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
          
          
          var uploadTask = storageRef.child(`images/${userP.uid}/profile_img/` + file.name).put(file, metadata);
    
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
              objStor["profile_img"] = downloadURL;
              writeUserData(userP.uid, objStor);
              console.log('File available at', downloadURL);
            });
          }
          );
        }
      }
    })
  }
}

// add subscribers
var subsValCount = 0
var subsVal = []

var subcmplt = document.querySelector("#subcmplt")

var subMe = (shopId) =>{
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

var subStat = document.querySelector("#subStat")

const getAllSub = (shopId, bool) => {
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
    if(bool == true) subStat.click()
  });
  return Promise.resolve("sucessfull")
}

getAllSub(location.search.substring(1), true) 


var genVal = []
const genMainStat = (x, y) => {
  var itemsKeys = firebase.database().ref(`${x}/${location.search.substring(1)}`)
  var count = 0
  itemsKeys.on('value', (snapshot, prevChildKey) => {
    gen = snapshot.val()
    genobj = {}
    if (count != 0) {
      console.log("Working Tree " + x + " for " + y + " " + count);
      for (const i in genVal) {
        if (Object.hasOwnProperty.call(genVal, i)) {
          if (genVal[i].name == y) {
            genVal.splice(i, 1); 
          }
          
        }
      }
    }
    count++
    
    if (!gen) {
      console.log("No Stat for "+ y);
      genobj.num = 0
      genobj.name = y
    } else {
      genKeys = Object.keys(gen)
      genobj.num = genKeys.length
      genobj.name = y
    }
    genVal.push(genobj);
    subStat.click()
  });
}

genMainStat("store", "Product")
genMainStat("reviews", "Reviews")
genMainStat("stor_subs", "Subscribed")



var getgenerated = () => {
  return genVal
}