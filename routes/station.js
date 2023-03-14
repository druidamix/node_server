import express from "express";
import { getLoginToken } from "./login.js";
import { url_get_station_list } from "../config/constants.js";
import axios from "axios";
import fetch from 'node-fetch';


const routerex = express.Router();

routerex.post('/',(req,res) =>{
    
    getLoginToken().then(data =>{
        
        let failCode = data.data['failCode'];
        
        if(failCode === 0){
            
            
            let token = data.headers['xsrf-token'];
            
            console.log(token);
            
            axios.post(url_get_station_list,{},{
                headers:{
                    "Content-Type": "application/json",
                    "XSRF-TOKEN":token,
                }
            }).then((r)=>{
                
                failCode = r.data['failCode'];
                if(failCode === 0){
                    console.log(JSON.stringify(r.data.data));
                    res.status(200).send(JSON.stringify(r.data.data));
                }else{
                    console.log("--failcode: "+failCode+ ', statusCode: '+r.status);
                    console.log(JSON.stringify(r.data));
                    res.status(400).send("failcode: "+failCode);
                }
            });
        }else{
            console.log("--failcode: "+failCode);
            res.status(400).send("failcode: "+failCode);
        } 
    
    });  
});

async function fetchSlist(token){
    const res =  await fetch(url_get_station_list,{method: 'POST', body: JSON.stringify(),headers:{
        "XSRF-TOKEN":token,
    }});
    
    return await res.json();
}

export default routerex;

