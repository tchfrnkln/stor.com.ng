const https = require('https')

const options = {
  hostname: 'api.paystack.co',
  port: 443,
  path: '/bank?currency=NGN',
  method: 'POST',
  headers: {
    Authorization: "sk_test_66334ba916425522ca1d12e8b51d8406fe8f74c2"
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
  console.log(error)
})