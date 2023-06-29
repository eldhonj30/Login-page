
var db = require('../config/connection');
var collection = require('../config/collections');
var objectId = require('mongodb').ObjectId
module.exports = {

  addProduct:(product,callback) => {
  db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data)=>{
    callback(data.insertedId);

   
  }).catch((err)=>{
    console.log(err);
  })     
  },
  getAllProducts:()=>{
    return new Promise(async(resolve,reject)=>{
      let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
      resolve(products)
    })
  },
  deleteProduct:(proId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(proId)}).then((response)=>{
        console.log(response);
        resolve(response);
      })
    })
  },
  getProductDetails:(proId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
        resolve(product)
      })
    })
  },
  updateProduct:(proId,proDetails)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(proId)},{
        $set:{
          Name:proDetails.Name,
          Description:proDetails.Description,
          MRP:proDetails.MRP,
          Category:proDetails.Category
        }
      }).then((response)=>{
        resolve()
      })
    })
  }
}