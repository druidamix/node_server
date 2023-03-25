import express from "express";
import {storeNewUserToken} from '../controllers/userController.js'


const router = express.Router();

router.post('/',(req,res) =>{
    storeNewUserToken(req.body.user).then(rows =>{
        res.status(200).send(rows.toString()); 
    }).catch(err =>{
        res.status(500).send("Internal Error");
    });
});


export  default router;