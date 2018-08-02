var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'WebTeam SuperSite' });
});

router.get('/dashboard', function(req, res, next){
  res.render('dashboard', { title: 'My Dashboard'});
});

router.get('/signup', function(req, res, next){
  res.render("signup");
});

//handles signup route
router.post("/signup", function(req, res){
  // var newUser = new User({
  //   //name.firstName: req.body.firstName,
  //   //lastName: req.body.lastName,
  //   email: req.body.email
  //   // password: req.body.password,
  //   // profileImageUrl: req.body.profileImageUrl,
  //   // team: req.body.team,
  //   // role: req.body.role
  // });
  // console.log(newUser);
  // User.register(newUser, function(err, user){
  //       if(err){
  //           console.log(newUser);
  //           console.log(err);
  //           return res.render("/signup")
  //       } else {
  //         res.redirect("/dashboard");
  //       }
  //     });
  res.send("test");
});

module.exports = router;
