import express from "express";
import { url_login } from "../config/constants.js";
import * as db from "../config/db.js"
import axios from "axios";



const router = express.Router();

//login
router.post('/',(req,res) =>{
    
    db.getUser(req.body.user,req.body.pass).then(rows =>{
        if(rows.length> 0){
            
            console.log('--Login');
            //Check if user ever logged.
            if(rows[0].first_login == 0){
                //reporting to create new password
                res.status(205).send({"data": "change password"});
                return;
            }
            
            //user logged correctly
            res.status(200).send({"data": "user logged"});
            console.log("--user logged");
        }else{
            console.log('--user not found');
            res.status(404).send("User not found");
        }
    });
});

//update password
router.post('/changepassword',(req,res)=>{
    
    db.changePassword(req.body.user,req.body.pass).then((result)=>{
        if(result === true){
            res.status(200).send("Password changed");
            return;
        }
        res.status(205).send("Error changing password");
    });
});

export  const getLoginToken  = async ()=> {
    
    
    
    const result =  await axios.post(url_login,{
        "userName":"marc_api",
        "systemCode":"comodore.9",
    },{
        headers:{
        "User-Agent": "Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion"
        }
    });
  
    return result;
   
};


export  default router;