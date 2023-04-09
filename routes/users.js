import express from "express";
import {getUsersFromDb} from '../controllers/userController.js'

const router = express.Router();

router.get('/',async (req,res) =>{
    console.log("--users")
    try{
    
        const users = await getUsersFromDb();
        
        res.status(200).send(users)
    }catch (error){
       
        res.status(500).send("Internal Error");
    }
    
});


export  default router;