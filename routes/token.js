import express from "express";
import {updateUserSecret} from '../controllers/authController.js'


const router = express.Router();

router.post('/',(req,res) =>{
    console.log('--entro token api')
    updateUserSecret(req.body.user,req.body.password).then(token =>{
        res.status(200).send(token.toString()); 
    }).catch(err =>{
        res.status(500).send("token Internal Error");
    });
});


export  default router;