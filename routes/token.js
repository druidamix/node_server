import express from "express";
import {generateToken} from '../controllers/authController.js'


const router = express.Router();



router.post('/',async (req,res) =>{

    try{
        if(!req.headers.bearer){
            throw Error('Bearer not found');
        }
        const token = await generateToken(req.headers.user,req.headers.bearer);
        
        res.status(200).send(token)
    }catch (error){
        console.log('--error ' + error);
        res.status(500).send("token Internal Error");
    }
    
});


export  default router;