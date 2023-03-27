var userP
auth.onAuthStateChanged(user => {
  if (user) {
    userP = user;
    console.log(user.email + " is logged in!");
    sessionStorage.setItem("uid", userP.uid)
  } else {
    if (sessionStorage.getItem("loggedOutANaccount") != "true") {
      console.log('User is logged out!')
      location.assign('../../../auth?redirect=' + location.href)
    } else {
      console.log("Just logging out! wait");
    }
  }
})


var scrollDown = document.querySelector('#scrollDown')

setInterval(() => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        scrollDown.classList.add("hidden")
    } else {
        scrollDown.classList.remove("hidden")
    }
}, 100);


scrollDown.addEventListener('click', () => {
    scrollTo(0, document.body.scrollHeight);
})

var SendForm = document.querySelector('#SendForm')

var sendFormInp = SendForm.querySelector('input')

var sendNowTrig = document.querySelector('#sendNowTrig')

SendForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("sendNowTrig");
    sendNowTrig.click()
})



// add to firedb

// chat/id1&id2/times-msg,time,userID

// write user to database editable to scale
const writeChat = (data) => {
  firebase.database().ref(`chat/${ref}/${shopId}/${key}`).set(data).then(res => {
    console.log(`Written ${data} to Shop with id ${shopId}`);
  })
}