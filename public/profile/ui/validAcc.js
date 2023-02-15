const nodemailer = require('nodemailer')

const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/sold', function (req, res) {
  var loc = req.originalUrl.substring(6)
  
  locArr = loc.split(",")
  
  if(locArr[0]) recipients[0].email = locArr[0]
  
  sndMail().then(()=>{
    res.redirect("https://stor.com.ng/profile/ordered?checkPaid&true")
  })
  
})

app.listen(3000)


const { MailtrapClient } = require("mailtrap");

const TOKEN = "636c2b09e6213148c8df0d6fe13db770";
const ENDPOINT = "https://send.api.mailtrap.io/";

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "mailtrap@stor.com.ng",
  name: "SToR.com.ng",
};

const recipients = [
  {
    email: "zmfrankoo@gmail.com",
  }
];


const sndMail = () => {
  // return console.log(`Mail pushed successfully to ${recipients[0].email}`);

  
  client
  .send({
    from: sender,
    to: recipients,
    subject: "You've Just Made a Sale",
    html: htmlVals,
    category: "Sales Notification",
  })
  .then(console.log, console.error);
  
  return Promise.resolve("successfull")
} 


const htmlVals = `
              <div>
                <h3>You've Just Sold an Item</h3>
                <br><br>
                <p>Congratulations on making a sale! This is fantastic news and I am absolutely thrilled for you!<br><br> Your hard work and dedication have paid off, and you should be proud of yourself for achieving this success.<br><br>Your sale is a testament to your outstanding abilities as a seller, and I have no doubt that this is just the beginning of many more great things to come for you. Keep up the amazing work and enjoy this moment of triumph!</p>
                <br><br>
                <b>You can See all the Items that was sold on your Dashboard</b>
                <br><br>
                <a href="https://stor.com.ng/profile/ordered">
                  See All Orders
                </a>
              </div>`;
