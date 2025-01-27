import express from "express";
import axios from "axios";
import bodyParser from "body-parser";


const app=express();
const port=process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));



const weatherAPI="https://api.openweathermap.org/data/2.5/weather";
const API_key="fe6ec069378bd2ea302cbd794a817076";
const geoAPI="http://api.openweathermap.org/geo/1.0/direct?q=cityname&appid={API key}";
const API_KEY_IP="e9dd55386d8a82";
const uni="metric";



app.get("/", async (req, res) => {
    
    try {
            const userip= req.ip;
            const response = await axios.get("https://ipinfo.io?token=" + API_KEY_IP);

            const locationData = response.data;
            var cityname=locationData.city;
            var cn=req.query.cityinput;
            
            if(cn){
                cityname=cn;
            }

            const result = await axios.get(weatherAPI + "?",{params: {q:cityname, appid:API_key,units:uni},});
            
            const localtimezone= Date.now() + 1000 * ( result.data.timezone/ 3600);
            const millitime = new Date(localtimezone);
            const dateFormat = millitime.toLocaleString();

            let day = millitime.toLocaleString("en-US", {weekday: "long"});
            let month = millitime.toLocaleString("en-US", {month: "long"}); 
            let date = millitime.toLocaleString("en-US", {day: "numeric"});
            let year = millitime.toLocaleString("en-US", {year: "numeric"}); 
            let hours = millitime.toLocaleString("en-US", {hour: "numeric"}); 
            let minutes = millitime.toLocaleString("en-US", {minute: "numeric"});
            const t=Math.round(result.data.main.temp); 
            res.render("index.ejs", { wicon:result.data.weather[0].icon, wtemperature:t,
                 wcondition:result.data.weather[0].description, wcity:result.data.name, wcountry:result.data.sys.country, d:date, m:month, y:year, });
            
      
    } catch (error) {
      res.render("index.ejs", {content: JSON.stringify(error.response)});
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });