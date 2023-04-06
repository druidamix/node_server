import express from "express";
import { url_login } from "../config/constants.js";
import axios from "axios";
import { getUserFromDb,updateUserPasword } from '../controllers/userController.js';
import { authenticateTokenMiddelWare ,generateRedundantToken} from "../controllers/authController.js";


const router = express.Router();

//login
router.post('/', async (req,res) =>{
 
    var user =  await getUserFromDb(req.body.user);

    if(user !=null){
      
        const token = await generateRedundantToken(req.body.user,req.body.pass);
        //Check if user ever logged.
        if(user.first_login == 0){
            //reporting to create new password
            res.status(206).json({"redundant_token": token});
            return;
        }
      
        //user logged correctly. Returing a redundant token
        res.status(200).send({"token": token});
        console.log("--user logged");
    }else{
        console.log('--user not found');
        res.status(404).send("Not found");
    }
});

//update password
router.post('/update_register',authenticateTokenMiddelWare,async (req,res)=>{
    
    updateUserPasword(req.body.user,req.body.pass).then((result)=>{
        if(result === true){
            res.status(200).send("Register updated");
            return;
        }
        res.status(205).send("Not found");
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