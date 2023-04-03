import express from "express";
import { getLoginToken } from "./login.js";
import  url_get_kpi_station_realtime  from "../config/constants.js";
import axios from "axios";


const router = express.Router();

router.post('/',async (req,res) =>{


    //Demo data
    res.status(200).send(
        {
          "day_power": (Math.random()*10).toFixed(2),
          "total_power": (Math.random()*500).toFixed(2)
        }
      );
    return;
    
    getLoginToken().then(data =>{
        
        let failCode = data.data['failCode'];
        
        if(failCode === 0){
            
            let token = data.headers['xsrf-token'];
            
            
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
