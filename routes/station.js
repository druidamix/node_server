import express from "express";
import { getLoginToken } from "./login.js";
import { url_get_station_list } from "../config/constants.js";
import axios from "axios";

const router = express.Router();

router.post('/',async (req,res) =>{
    
    // demo data
    res.status(200).send([
        {'stationName':'Station 1','stationAddr':'Plaça esglesia nº8','stationCode':'stcode1'},
        {'stationName':'Station 2','stationAddr':'Prudenci Murillo nº2','stationCode':'stcode2'}
    ]);
    return;
    
    getLoginToken().then(data =>{
        
        let failCode = data.data['failCode'];
        
        if(failCode === 0){
            
            
            let token = data.headers['xsrf-token'];
            
            
            axios.post(url_get_station_list,{},{
                headers:{
                    "Content-Type": "application/json",
                    "XSRF-TOKEN":token,
                }
            }).then((r)=>{
                
                failCode = r.data['failCode'];
                if(failCode === 0){
                    console.log(JSON.stringify(r.data.data));
                    res.status(200).send([{'stationName':'Station 1','stationAddr':'Plaça esglesia nº8'},
                    {'stationName':'Station 2','stationAddr':'Prudenci Murillo nº2'}]);
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



export default router;

