
var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var localStrategy = require("passport-local");
var session = require("express-session");
var User = require("../models/user");
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var smtpTransport = require('nodemailer-smtp-transport');
var xoauth2 = require('xoauth2');

//Forgot Password
router.get('/forgot', function(req, res) {
    res.render('forgot',{
      user: req.user
    });
  });
  router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          console.log(user);
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            console.log(req.body.email);
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          host: "smtp.gmail.com",
          auth: {
            type: "OAuth2",
            user: 'televox17@gmail.com',
            clientId: "97383977732-n0uib97f2pn1ahlt9vts8jt1hvkqfhc1.apps.googleusercontent.com",
            clientSecret: "jhVxWCz8vtKj4x8tqg2xoqwn",
            refreshToken: "1/22_T0sn9-4MR_gib7OSAbQv0AZlp1_YRsRT6d9NvtlVZcNxnciwUfDO9M1RAZ8-m"
          
          }, 
          tls: {
            rejectUnauthorized: false
        }
        });
        var mailOptions = {
          to: user.email,
          from: 'televox17@gmail.com',
          subject: 'WebTeam SuperSite Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      req.flash("success", "Email will be sent soon");
      res.redirect('/');
    });
  });
  
  //reset password
  router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        console.log(err);
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {
        user: req.user
      });
    });
  });
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            console.log(err);
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          user.setPassword(req.body.password, function(){
            user.save(function(err){
                res.redirect('/login');
                
                // res.redirect('/dashboard');
            });
        });
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          host: "smtp.gmail.com",
          auth: {
            type: "OAuth2",
            user: 'televox17@gmail.com',
            clientId: "97383977732-n0uib97f2pn1ahlt9vts8jt1hvkqfhc1.apps.googleusercontent.com",
            clientSecret: "jhVxWCz8vtKj4x8tqg2xoqwn",
            refreshToken: "1/22_T0sn9-4MR_gib7OSAbQv0AZlp1_YRsRT6d9NvtlVZcNxnciwUfDO9M1RAZ8-m"
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'televox17@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });

  module.exports = router;