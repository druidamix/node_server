
import express from "express";
import { getLoginToken } from "./login.js";
import { url_get_kpi_station_realtime } from "../config/constants.js";
import axios from "axios";

const router = express.Router();


router.post('/',(req,res) =>{
    console.log('----');
    console.log(req.body.stationCodes);
   
    res.status(200).send(
        {
          "day_power": 12.4,
          "total_power": 590
        }
      );
    return;
    
    getLoginToken().then(data =>{
        
        let failCode = data.data['failCode'];
        
        if(failCode === 0){
            
            let token = data.headers['xsrf-token'];
            
            console.log(token);
            
            axios.post(url_get_kpi_station_realtime,{"stationCodes": req.body.stationCodes},{
                headers:{
                    "Content-Type": "application/json",
                    "XSRF-TOKEN":token
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

export default router;
