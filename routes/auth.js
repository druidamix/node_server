import express from "express";
import {generateJwtToken} from '../controllers/authController.js'

const router = express.Router();

router.post('/',async (req,res) =>{

    try{
        if(!req.headers.redundant){
            throw Error('missing not found');
        }
        const token = await generateJwtToken(req.headers.user,req.headers.redundant);
        
        res.status(200).send(token)
    }catch (error){
        console.log('--Auth error:  ' + error);
        res.status(500).send("Internal Error");
    }
    
});


export  default router;