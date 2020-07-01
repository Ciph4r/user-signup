const express = require('express');
const router = express.Router();
const passport = require('passport');
const nanoid = require('nanoid')
const User = require('../routes/models/User')
const bcrypt = require('bcryptjs');
const mailjet = require ('node-mailjet')
.connect(process.env.MAILKEY , process.env.MAILSECRET)
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
            "HTMLPart": `<h3>Dear ${name}, welcome to <a href='http://localhost:3000/update/${username}'>RANDOM APP</a>!</h3><br />Click on the provided link to complete setup and your temp password is ${random}`,
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

})


router.get('/update/:username' , (req,res) => {
  User.findOne({username : req.params.username}).then((user) => {
    if(user.access){
      req.flash('errors', 'this page doesnt exist, u already changed your temp password');
      return res.render('error')
      
    }
    return res.render('update')
  })
})


router.put('/update/complete' , (req,res,next) => {
  User.findOne({username: req.body.username}).then((user)=> {
    if(!user){
        req.flash('errors', 'user doesnt exist');
      // return res.redirect(301, `/update/complete`)
      return res.redirect('back')
    }
    if(user.password !== req.body.temp){
        req.flash('errors', 'invalid temp password');
        return res.redirect('back')
    }
    if(req.body.password !== req.body.password2){
       req.flash('errors', 'new password doesnt match');
      return res.redirect('back')
    }
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt)
    user.password = hash
    user.access = true
    user.save().then(user => {
        passport.authenticate('local-login', function(err, username, info) {
          if (err) { return next(err); }
          req.logIn(username, function(err) {
            if (err) { return next(err) }
            return res.redirect('/home')
          });
        })(req, res, next)
    })
  })
})

  router.get('/home' , auth, (req,res,next) =>{
    res.render('home')

  })

  router.get('/logout' , (req,res,next)=> {
    req.logout();
    req.flash('success', 'You are now logged out');
    return res.redirect('/')
  })

router.post('/login',
passport.authenticate('local-login', {
  successRedirect: '/home',
  failureRedirect: '/',
  failureFlash: true
}))

module.exports = router;