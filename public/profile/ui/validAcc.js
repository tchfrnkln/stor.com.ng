// const https = require('https')

// const options = {
//   hostname: 'api.paystack.co',
//   port: 443,
//   path: '/bank/resolve?account_number=0001234567&bank_code=058',
//   method: 'GET',
//   headers: {
//     Authorization: 'pk_live_bdaedf9d29d5f6fbc1af4b369cf705b9b10a4076'
//   }
// }

// https.request(options, res => {
//   let data = ''

//   res.on('data', (chunk) => {
//     data += chunk
//   });

//   res.on('end', () => {
//     console.log(JSON.parse(data))
//   })
// }).on('error', error => {
//   console.error(error)
// })



const accountSid = 'AC464962af4d566c1791e473d214226427'; 
const authToken = '05926396c9a9ef527d11cd19b6e46f67'; 
const client = require('twilio')(accountSid, authToken); 
 
client.messages 
      .create({ 
         body: 'Hello! This is an editable text message. You are free to change it and write whatever you like.', 
         from: 'whatsapp:+14155238886',       
         to: 'whatsapp:+2348153244501' 
       }) 
      .then(message => console.log(message.sid)) 
      // .done();