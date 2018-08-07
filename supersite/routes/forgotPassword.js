
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
            user: 'haneyjustin39301@gmail.com',
            clientId: "961175264707-1hgvgj6hrekhmvedrm20qhbi3j9jt1vj.apps.googleusercontent.com",
            clientSecret: "bm8CRwSb2SxQ3pE_twA74LD_",
            refreshToken: "1/vUk8ReSaxeZ_EB9hK-_EJc5K_4hlIvmQEeiyStX3Rxc"
          
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'haneyjustin39301@gmail.com',
          subject: 'Node.js Password Reset',
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
      res.redirect('/forgot');
    });
  });
  
  //reset password
  router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
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
            user: 'haneyjustin39301@gmail.com',
            clientId: "961175264707-1hgvgj6hrekhmvedrm20qhbi3j9jt1vj.apps.googleusercontent.com",
            clientSecret: "bm8CRwSb2SxQ3pE_twA74LD_",
            refreshToken: "1/vUk8ReSaxeZ_EB9hK-_EJc5K_4hlIvmQEeiyStX3Rxc"
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'haneyjustin39301@gmail.com',
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

  //middleware
  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
  }

  module.exports = router;