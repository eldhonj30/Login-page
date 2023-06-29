var db = require('../config/connection');
var collection = require('../config/collections');
const bcrypt = require('bcrypt')
var alert = require("alert")

module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      let userExist = await db.get().collection(collection.USER_COLLECTIONS).findOne({email:userData.email})
      if(!userExist){
      if (!userData.password || userData.password.trim() === '') {
        reject(new Error('Password field is required'));
        return;
      }

      try {
        userData.password = await bcrypt.hash(userData.password, 10);
        const data = await db.get().collection(collection.USER_COLLECTIONS).insertOne(userData);
        resolve(data);
      } catch (err) {
        reject(err);
      }}else{
       resolve(1)
      }
    });
  },
  doLogin:(userData)=>{
    return new Promise(async(resolve,reject)=>{
        let loginStatus=false;
        let response={}
        let user=await db.get().collection(collection.USER_COLLECTIONS).findOne({email:userData.email})
        if(user){
            bcrypt.compare(userData.password,user.password).then((status)=>{
                if(status){
                    console.log("login success")
                    response.user=user;
                    response.status=true;
                    resolve(response)
                }else{
                    console.log("login fail");
                    resolve({status:false})
                }
            })
        }else{
            console.log('login failed');
            resolve({status:false});
        }
    })
}
}