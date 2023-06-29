var express = require('express');
const productHelpers = require('../helpers/product-helpers');
const fileUpload = require('express-fileupload');
var router = express.Router();
const adminHelpers=require('../helpers/admin-helpers')
const verifyLogin=(req,res,next)=>{
  if(req.session.admin && req.session.admin.loggedIn){
    next()
  }else{
    res.redirect('/admin/adminLogin')
  }
}
/* GET users listing. */
router.get('/',verifyLogin, function(req, res, next) {
  let admin=req.session.admin
  productHelpers.getAllProducts().then((products)=>{

    res.render('admin/view-products',{admin:true,products,admin});
  })

});

router.get('/add-products',verifyLogin,(req,res)=>{
  res.render('admin/add-products',{admin:true})
});

router.post('/add-products',(req,res)=>{

  productHelpers.addProduct(req.body,(insertedId)=>{
    console.log(req.body);
    
    let image = req.files.Image
    console.log(req.files.Image);
    image.mv('./public/product-images/'+insertedId+'.jpg',(err)=>{
      if(!err){
        res.render('admin/add-products');
      }else{
        console.log(err)
      }
    })
  
  });
})
router.get('/delete-product/:id',verifyLogin,(req,res)=>{
  let proId = req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
})

router.get('/edit-product/:id',verifyLogin, async(req,res)=>{
  let product = await productHelpers.getProductDetails(req.params.id)
  console.log(product);
  res.render('admin/edit-product',{product})
})

router.post('/edit-product/:id',(req,res)=>{
  let id = req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    
    res.redirect('/admin')
    if(req.files.Image){
      let image = req.files.Image
      image.mv('./public/product-images/'+id+'.jpg')
    }
  })
})

//-----------------------------
router.get('/adminLogin',function(req,res){
  if(req.session.admin){
    res.redirect("/admin") 
  }
  else{
    res.render("admin/login",{"loginErr":req.session.adminLoginErr})
    req.session.adminLoginErr=false
  }
 
})
router.post('/adminLogin',(req,res)=>{
  adminHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      
      console.log("Admin successfully loged in");
      req.session.admin=response.admin
      req.session.admin.loggedIn=true
      res.redirect('/admin')
    }
    else{
      req.session.adminLoginErr=true
      res.redirect('/admin/adminLogin') 
    }
  })
})
router.get("/adminLogout",verifyLogin,function(req,res){
  req.session.admin = null;
  res.redirect("/admin/adminLogin")
})

//------------------------all users
router.get("/all-users",verifyLogin,async (req,res)=>{
  let users=await adminHelpers.getAllUsers(req.session)
  res.render("admin/all-users",{admin:true,users})
})
//----------------------------------------

module.exports = router;
