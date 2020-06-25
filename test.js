const mailjet = require ('node-mailjet')
.connect('d0e1a602474f855c9997b1ca1440a645', '8ae0f7c34d446d5c89f18875d1688673')
const request = mailjet
.post("send", {'version': 'v3.1'})
.request({
  "Messages":[
    {
      "From": {
        "Email": "david.lau@codeimmersives.com",
        "Name": "Dave"
      },
      "To": [
        {
          "Email": "david.lau@codeimmersives.com",
          "Name": "Dave"
        }
      ],
      "Subject": "Greetings from Mailjet.",
      "TextPart": "My first Mailjet email",
      "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
      "CustomID": "AppGettingStartedTest"
    }
  ]
})
request
  .then((result) => {
    console.log(result.body)
  })
  .catch((err) => {
    console.log(err.statusCode)
  })

