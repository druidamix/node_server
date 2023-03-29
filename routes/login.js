import express from "express";
import { url_login } from "../config/constants.js";
import axios from "axios";
import  {validateRequest,getUserFromDb,updateUserPasword} from '../controllers/userController.js';

const router = express.Router();

//login
router.post('/', async (req,res) =>{
    
    console.log(req);
    const isValidUser = validateRequest(req.body.user, req.body.lru);
    
    if(!isValidUser){
        console.log('--invalid user')
        res.status(401).send('Unauthorized');
        return;
    }
   

    var user =  await getUserFromDb(req.body.user,req.body.pass);

    if(user !=null){
            
        console.log('--Login');
        //Check if user ever logged.
        if(user.first_login == 0){
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

//update password
router.post('/changepassword',async (req,res)=>{
    
    const isValidUser = await validateRequest(req.body.user,req.body.lru);
    
    if(!isValidUser){
        res.status(401).send('Unauthorized');
        return;
    }

    updateUserPasword(req.body.user,req.body.pass).then((result)=>{
        if(result === true){
            res.status(200).send("Password changed");
            return;
        }
        res.status(205).send("Error changing password");
    });
});

export const getLoginToken  = async ()=> {
    
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


export default router;