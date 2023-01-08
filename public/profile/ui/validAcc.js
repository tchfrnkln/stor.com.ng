const https = require('https')

const options = {
  hostname: 'api.paystack.co',
  port: 443,
  path: '/bank/resolve?account_number=0001234567&bank_code=058',
  method: 'GET',
  headers: {
    Authorization: 'pk_live_bdaedf9d29d5f6fbc1af4b369cf705b9b10a4076'
  }
}

https.request(options, res => {
  let data = ''

  res.on('data', (chunk) => {
    data += chunk
  });

  res.on('end', () => {
    console.log(JSON.parse(data))
  })
}).on('error', error => {
  console.error(error)
})