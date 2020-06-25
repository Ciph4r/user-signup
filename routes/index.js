const express = require('express');
const router = express.Router();
const passport = require('passport');
const nanoid = require('nanoid')
const User = require('../routes/models/User')
const mailjet = require ('node-mailjet')
.connect('d0e1a602474f855c9997b1ca1440a645', '8ae0f7c34d446d5c89f18875d1688673')
require('dotenv').config()


/* GET home page. */

const auth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.send('You are not authorized to view this page');
  }
};


router.get('/', function (req, res, next) {

  res.render('index');
});







router.post('/', (req, res, next) => {
  User.findOne({
    email: req.body.email
  }).then((user) => {
    if (user) {
      req.flash('errors', 'Account exists')
      return res.redirect(301, '/')
    } else {
      const newUser = new User()
      const {
        name,
        username,
        email,
        number,
        city,
        state
      } = req.body
      // const salt = bcrypt.genSaltSync(10)
      // const hash = bcrypt.hashSync(req.body.password, salt)
      const random = nanoid.nanoid(10)
      newUser.name = name
      newUser.username = username
      newUser.email = email
      newUser.password = random
      newUser.address.number = number
      newUser.address.city = city
      newUser.address.state = state

      newUser
        .save()
        .catch((err) => console.log('Error here'))
        ///////////
      const request = mailjet
        .post("send", {
          'version': 'v3.1'
        })
        .request({
          "Messages": [{
            "From": {
              "Email": "david.lau@codeimmersives.com",
              "Name": "Dave"
            },
            "To": [{
              "Email": email,
              "Name": name
            }],
            "Subject": "Greetings from Random APP.",
            "TextPart": "",
            "HTMLPart": `<h3>Dear ${name}, welcome to <a href='http://localhost:3000/update/${random}'>RANDOM APP</a>!</h3><br />Click on the provided link to complete setup`,
            "CustomID": ""
          }]
        })
      request
        .then((result) => {
          req.flash('success', 'THANK YOU FOR REGISTERING , CHECK YOUR EMAIL');
          return res.redirect(301, '/')
        })
        .catch((err) => {
          console.log(err.statusCode)
        })
      /////////////

    }
  })

  router.get('/update/:password' , (req,res) => {
    User.findOne({password : req.params.password}).then((user) => {
      res.render('update')
    })
  })

})

module.exports = router;