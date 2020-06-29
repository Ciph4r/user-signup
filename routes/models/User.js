const mongoose = require('mongoose');




const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true },
  username: { type: String, unique: true, required: true, lowercase: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  address: {
      number: String,
      city: String,
      state: String 
  },
  password: { type: String, required: true, min: 3 },
  access : {type:Boolean , default: false}

});

module.exports = mongoose.model('User', UserSchema);




// router.post('/update/complete' , (req,res,next) => {
//   User.findOne({username: req.body.username}).then((user)=> {
//     if(!user){
//         req.flash('errors', 'user doesnt exist');
//       return res.redirect(301, '/update')
//     }
//     if(user.password !== req.body.temp){
//         req.flash('errors', 'invalid temp password');
//         return res.redirect(301, '/update')
//     }
//     if(req.body.password !== req.body.password2){
//        req.flash('errors', 'new password doesnt match');
//       return res.redirect(301, '/update')
//     }
//     user.password = req.body.password
//     user.access = true
//     user.save().then(user => {
//       res.render('home')
//     })
//   })
// })