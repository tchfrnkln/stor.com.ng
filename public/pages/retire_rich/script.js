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
                        // console.log(document.cookie);
                    redirectUser();
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
                firebase.database().ref(`users/${x}`).set(nUser)
                // setCookie("store_name", userP.displayName)
                // setCookie("profile_img_pre", userP.photoURL)
                redirectUser();
            }
        })        
}


// auth state change
var userP, toProfile;
auth.onAuthStateChanged(user => {
    if (user) {
        userP = user;
        setCookie("uid", user.uid)
        toProfile = `../../profile?get=${userP.uid}`
        getAllSub(user.email).then(() => {  
            snap(userP.uid)
        })
  } else {
        console.log('User is logged out!')
        sessionStorage.setItem("loggedOutANaccount", false)
  }
})

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


var googleAuthbtn = document.querySelectorAll('#googleAuthbtn');


for (let i = 0; i < googleAuthbtn.length; i++) {
    googleAuthbtn[i].addEventListener('click',()=> googleAuth.click())
    
}

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