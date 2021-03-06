const  express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/main.html");
});


app.post("/",function(req,res){
    var today = new Date();
    var options = { weekday: 'long',day: 'numeric', month: 'long'};
    var day = today.toLocaleDateString("en-US", options);
    const cityName = req.body.cityInput;
    const apnkey = "8fc700afb06584548f8e43174e308eb0";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+apnkey+"&units="+unit;

    https.get(url,function(response){
        response.on("data",function(data){
            const wheatherdata = JSON.parse(data);
            const code = wheatherdata.cod;
            console.log(code);
            // const iconurl = "http://openweathermap.org/img/w/"+Icon+".png";
            // const iconHTML = "<img src="+iconurl+"></img>"

            if(code === 200){
                const Temperature=wheatherdata.main.temp;
                const description=wheatherdata.weather[0].description;
                const name=wheatherdata.name;
                const min=wheatherdata.main.temp_min;
                const max=wheatherdata.main.temp_max;
                const Icon=wheatherdata.weather[0].icon;
                res.render("weather",{
                    location: name,
                    currDay: day,
                    condition: description,
                    temprature: Temperature,
                    min: min,
                    max: max,
                    icon: Icon
                });
            }
            else{
                res.render("failure",{});
            }
        });
    });
});

app.get("/searchagain",function(req,res){
    res.sendFile(__dirname+"/main.html");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("ported to 3000.")
})