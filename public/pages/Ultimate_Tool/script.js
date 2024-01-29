var userP, toProfile;
auth.onAuthStateChanged(user => {
    if (user) {
        userP = user;
        console.log("Active", userP.email);
        
        var paymentFormInp = document.querySelector('#paymentForm').querySelectorAll('input');

        var U_names = userP.displayName.split(" ")

        paymentFormInp[0].value = userP.email
        paymentFormInp[1].value = 14990
        paymentFormInp[2].value = U_names[0]
        paymentFormInp[3].value = U_names[1]
  } else {
        console.log('User is logged out!')
        // location.assign('../../auth?redirect=' + location.href)
  }
})



const paymentForm = document.getElementById('paymentForm');
const payWithPaystackBtn = document.getElementById('payWithPaystackBtn');

paymentForm.addEventListener("submit", payWithPaystack, false);

function payWithPaystack(e) {
  e.preventDefault();

  let handler = PaystackPop.setup({
    key: 'pk_live_bdaedf9d29d5f6fbc1af4b369cf705b9b10a4076', // Replace with your public key
    email: document.getElementById("email-address").value,
    amount: document.getElementById("amount").value * 100,
    ref: ''+Math.floor((Math.random() * 1000000000) + 1), 
    onClose: function(){
      alert('Window closed.');
    },
    callback: function(response){
      let message = 'Payment complete! Reference: ' + response.reference;
      alert(message, "An invitation Mail will to sent to Your Email Address");
    }
  });

  handler.openIframe();
}


var payNowBtnAll = document.querySelectorAll('#payNowBtn')

for (let i = 0; i < payNowBtnAll.length; i++) {
  payNowBtnAll[i].addEventListener('click', () => {
      var URL =  "https://api.whatsapp.com/send/?phone=2348153244501&text=I%20want%20to%20make%20payment%20Immediately"
      return window.open(URL, '_blank');
      payWithPaystackBtn.click()       
    })
    
}


var whbtn = document.querySelector('#whbtn')

whbtn.addEventListener('click', () => {
    location.assign('https://wa.me/message/Z3Q6RPD67FAVP1')
})