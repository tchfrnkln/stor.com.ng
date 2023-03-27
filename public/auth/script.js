const logIn_form = document.querySelector('#logIn_form');
const signUp_form = document.querySelector('#signUp_form');
const verificationSent_form = document.querySelector('#verificationSent_form');
const verified_form = document.querySelector('#verified_form');

// const logoutBtn = document.querySelector('#logout-btn');

// check and update auth form

var loc = location.search.substring(1)

const checkform = (a) => {
    var classAdder = (j) => {
        j.classList.add('hidden')
    }
    var classClear = (j) => {
        j.classList.remove('hidden');
    }
    classAdder(logIn_form);
    classAdder(signUp_form);
    classAdder(verificationSent_form);
    classAdder(verified_form);
    if (a == 1) {
        classClear(logIn_form)
    } else if(a == 2){
        classClear(signUp_form)    
    } else if (a == 3) {
        classClear(verificationSent_form)
    } else {
        classClear(verified_form)
    }
}

if (loc == "signup") {
    checkform("2")
} else if (loc == "login") {
    checkform("1")
}

// get info funx imported from auths

// sigup Auth
signUp_form.addEventListener('submit',(e)=> {
    e.preventDefault();
    
    // get infos
    getInfo(signUp_form);
    
    auth.createUserWithEmailAndPassword(inpValues[0].email, inpValues[0].password).then(cred => {
        console.log(cred);
        signUp_form.reset()
        location.assign('../profile');
    }).catch(error => {
        console.log(error.message);
    })
})

// login Auth
logIn_form.addEventListener('submit', (e) => {
    e.preventDefault()    
    // get info
    getInfo(logIn_form);
    
    auth.signInWithEmailAndPassword(inpValues[0].email, inpValues[0].password).then(cred => {
        console.log("logged in user");
        logIn_form.reset();
        location.assign('../profile');
    }).catch(err => {
        console.log(err.message);
    })
    
})



// logout Auth
// logoutBtn.addEventListener('click', e => {
//   e.preventDefault();
//   auth.signOut();
//   console.log('User signed out!');
// })



const redirectUser = () => {
    if (location.search.substring(1, 9) == "redirect") {
        location.assign(`${location.search.substring(10)}`)
    }else{
        location.assign(toProfile)
    }
}

// get user function
const snap = (x) => {
    var starCountRef = firebase.database().ref(`users/${x}`);
    starCountRef.on('value', (snapshot) => {
        snapData = snapshot.val(); //an object
        if (!(snapData === null)) {
            setCookie("was_updated", true)
            
            var addLogCookies = () => {
                for (const key in snapData) {
                    if (Object.hasOwnProperty.call(snapData, key)) {
                        setCookie(key, snapData[key])
                    }
                }
                return Promise.resolve("Success");
            }
            addLogCookies().then(() => {
                setTimeout(() => {
                    redirectUser()
                }, 2000)
                }
            )
        } else {
            // user not in db
            nUser = {}
            nUser['store_name'] = userP.displayName;
            nUser['profile_img'] = userP.photoURL;
            nUser['store_about'] = "Short About on your niche, products and experiences";
            nUser['store_desc'] = "A more Detailed and description of your SToR";
            nUser['store_location'] = "Valid Location of a Physical Store";
            nUser['tag_line'] = "Tag Line";
            nUser["upLine"] = upLine;
            firebase.database().ref(`users/${x}`).set(nUser)
            
            // set affiliate amount on affiliate/count
            
            var affcValCount
            
            firebase.database().ref(`affiliate/count/${upLine}`).once('value').then((snapshot) => {
                affc = snapshot.val()
                
                if (!affc) {
                  affcValCount = 0
                } else {
                    affcKeys = Object.keys(affc)
                    affcValCount = affcKeys.length      
                }
                
                firebase.database().ref(`affiliate/count/${upLine}/${parseInt(affcValCount) + 1}`).set(x).then(() => {
                    redirectUser()
                })
            })
        }
    })        
}


// auth state change
var userP, toProfile;
auth.onAuthStateChanged(user => {
    if (user) {
        userP = user;
        setCookie("uid", user.uid)
        toProfile = `../profile?get=${userP.uid}`
        getAllSub(user.email).then(() => {  
            snap(userP.uid)
        })
  } else {
        console.log('User is logged out!')
        sessionStorage.setItem("loggedOutANaccount", false)
  }
})



// auth with goggle 
const googleAuth = document.querySelector('#googleAuth');

googleAuth.addEventListener('click', () => {
    firebase.auth()
    .signInWithPopup(provider)
    .then(result => {
        var credential = result.credential;
        var token = credential.accessToken;
        var user = result.user;
        // console.log(user);
    }).catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.log(errorMessage)
        alert(`${errorMessage}, Check your Internet connection and Refresh Page`)
    })
})


// sign out code
// firebase.auth().signOut().then(() => {
//   // Sign-out successful.
// }).catch((error) => {
//   // An error happened.
// });


var subsValCount = 0;

const getAllSub = (email) => {
    email = escapeInput(email)
    var itemsKeys = firebase.database().ref(`subs`);
    itemsKeys.on('value', (snapshot, prevChildKey) => {
        subs = snapshot.val()
        subsVal = []
        // get subsVal
        if (!subs) {
        console.log("No subscribers");
        } else {
        subsKeys = Object.keys(subs)
        subsValCount = subsKeys.length  
        subsVal = Object.values(subs)
        }
        // subsVal gotten, input to subs if not subscribed
        if(!subsVal.includes(email)){
        firebase.database().ref(`subs/${parseInt(subsValCount) + 1}`).set(email).then(res => {
            console.log("added to db");
        })
        } else {
            console.log("User is Subscribed");
        }
    });
  
    return Promise.resolve("Success")
}



// automate if url

// if (location.search.substring(1) == "automate") {
//     console.log("should automate at this point");
    
//     var domReady = setInterval(() => {
//         if (document.readyState == 'complete') {
//             console.log("Load completed");
//             googleAuth.click()
//             clearInterval(domReady)
//         }
//     }, 500);
// }



var upLineLink = location.search.split("?")


upLine = upLineLink[upLineLink.length - 1]

if (upLine.includes(",")) {
    nLink = upLine.split(",")
    upLine = nLink[nLink.length - 1]
}


if (upLine == "") {
    upLine = "tPXhbp1DaPU5YWtChEOMEpNaFVH2"
}

console.log("upLine", upLine);