import express from 'express';
import axios from 'axios';
import { getLoginToken } from './login';
import { url_get_station_list } from '../config/constants';

const router = express.Router();

router.post('/', async (_, res) => {
  // demo data
  res.status(200).send([
    { stationName:'Station 1',stationAddr:'Plaça esglesia nº8',stationCode:'stcode1' },
    { stationName:'Station 2',stationAddr:'Prudenci Murillo nº2',stationCode:'stcode2' },
  ]);
  return;

  //Not used, since I don't have permission on huawei solar
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

