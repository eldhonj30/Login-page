var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const alert=require("alert")
/* GET home page. */

const verifyLogin=(req,res,next)=>{
  if(req.session.user.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}

router.get('/',function(req, res, next) {
  let user = req.session.user;
  console.log(user);
  productHelpers.getAllProducts().then((products)=>{

    res.render('user/view-products',{products,user});
  })
});

router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  } else{
    res.render('user/login',{"loginError":req.session.loginError})
    req.session.loginError = false;
  }
});

router.get('/signup',(req,res)=>{
  res.render('user/signup',{"loginError":req.session.loginError})
  req.session.loginError = false;
})

router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    if(response==1){
      console.log("already sign up")
      req.session.loginError = "Email Already Used"
      res.redirect('/signup')
    }
    if(response!=1){
      req.session.user = response;
       req.session.user.loggedIn = true;
      res.redirect('/login')
    }
   
  })
})

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect('/')
    }else{
      req.session.loginError = "Invalid username or password"
      res.redirect('/login')
    }
  })
})
router.get('/add to cart',verifyLogin,(req,res)=>{
  if(!req.session.loggedIn){
    res.redirect('/login')
  }
})

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/')
})

module.exports = router;
