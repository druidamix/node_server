import express from "express";
import { url_login } from "../config/constants.js";
import axios from "axios";
import { getUserFromDb,updateUserPasword } from '../controllers/userController.js';
import { authenticateTokenMiddelWare ,generateLoginToken} from "../controllers/authController.js";

const router = express.Router();

//login
router.post('/', async (req,res) =>{
 
    var user =  await getUserFromDb(req.body.user,req.body.pass);

    if(user !=null){
      
        const token = await generateLoginToken(req.body.user);
        console.log(token);

        //Check if user ever logged.
        if(user.first_login == 0){
            console.log("-- 205, reset password: "+token)
            //reporting to create new password
            res.status(206).json({"bearer_token": token});
            return;
        }
      
        //user logged correctly. Returing a bearer token
        res.status(200).send({"bearer_token": token});
        console.log("--user logged");
    }else{
        console.log('--user not found');
        res.status(404).send("User not found");
    }
});

//update password
router.post('/update_register',authenticateTokenMiddelWare,async (req,res)=>{
    
    updateUserPasword(req.body.user,req.body.pass).then((result)=>{
        if(result === true){
            res.status(200).send("Register updated");
            return;
        }
        res.status(205).send("Error updating register");
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