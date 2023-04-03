import express from "express";
import {generateToken} from '../controllers/authController.js'


const router = express.Router();



router.post('/',async (req,res) =>{

    try{
    const token = await generateToken(req.body.user,req);
  
    res.status(200).send(token)
    }catch (error){
        res.status(500).send("token Internal Error");
    }
 
});


export  default router;