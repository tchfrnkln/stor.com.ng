const express = require('express')

const app = express()
const sgMail = require('@sendgrid/mail')
const sendGridMail = require('@sendgrid/mail')


app.set("view engine", "ejs")

mailkey = "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"



app.get('/', (req, res) => {
    res.render("index", { name: "Franklin" });
})    

app.get('/send', (req, res) => {
  res.render("index", { name: ", Your message is sending" });
  
  sgMail.setApiKey(mailkey)
  const msg = {
    to: 'tchfrnkln@gmail.com', // Change to your recipient
    from: 'us@stor.com.ng', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
  sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })      
})

app.get('/demo', (req, res) => {
  res.render('index', {name: "Demo"})

  sendGridMail.setApiKey(mailkey);

  function getMessage() {
    const body = 'This is a test email using SendGrid from Node.js';
    return {
      to: 'tchfrnkln@gmail.com',
      from: 'us@stor.com.ng',
      subject: 'Test email with Node.js and SendGrid',
      text: body,
      html: `<strong>${body}</strong>`,
    };
  }

  async function sendEmail() {
    try {
      await sendGridMail.send(getMessage());
      console.log('Test email sent successfully');
    } catch (error) {
      console.error('Error sending test email');
      console.error(error);
      if (error.response) {
        console.error(error.response.body)
      }
    }
  }

  (async () => {
    console.log('Sending test email');
    await sendEmail();
  })();
})

app.listen(3000, () => console.log("mailkey", mailkey))
