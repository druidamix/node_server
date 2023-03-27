import express from "express";
import {updateUserToken} from '../controllers/userController.js'


const router = express.Router();

router.post('/',(req,res) =>{
    updateUserToken(req.body.user,req.body.password).then(token =>{
        res.status(200).send(token.toString()); 
    }).catch(err =>{
        res.status(500).send("Internal Error");
    });
});


export  default router;