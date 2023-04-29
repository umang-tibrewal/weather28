const express =require("express");

const bodyParser =require("body-parser");

const app=express();


app.set('view engine','ejs');


app.use(bodyParser.urlencoded({extended:true}));

const https=require("https");


app.use(express.static("public"));
app.get("/",function(req,res){


res.render("list");


});


app.post("/",function(req,res){


  var firstname=req.body.fn;
  var secondname=req.body.sn;

  var email=req.body.email;

console.log(firstname,secondname);

  var data ={

members:[
  {

email_address: email,

status:"subscribed",

merge_fields:{

        FNAME:firstname,
        LNAME:secondname



}


  }
]

};

const jasondata=JSON.stringify(data);

const url="https://us20.api.mailchimp.com/3.0/lists/13b820e474";


const options={

method:"POST",
auth:"umang:1549afc3cbee6805b0301cf84f171a00-us20"


}



const request=https.request(url,options,function(response){

if(response.statusCode===200){
res.sendFile(__dirname+"/main.html");


}

else {
res.sendFile(__dirname+"/fail.html");

}
response.on("data",function(data){

  console.log(JSON.parse(data));
})

})



request.write(jasondata);
request.end();








})


app.post("/main" , function(req,res){

var val=req.body.button;

if(val==="back")
{
res.redirect("/");

}

else{
var query=req.body.city;


const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid=0e2c74ceefa7da7df7349ac2f545d27a&units=metric";

https.get(url,function(response){

response.on("data",function(data){


const weatherdata=JSON.parse(data);

var city_name=weatherdata.name;
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();
var date=today.toLocaleDateString("en-US", options);

var temp=Math.round(weatherdata.main.temp);
var discription=weatherdata.weather[0].description;

var wind=weatherdata.wind.speed;
var fells=weatherdata.main.feels_like;

res.render("result",{today_date:date,city:city_name,tempreature:temp,disp:discription,winds:wind,fell:fells});

})



})




}

})



app.post("/fail",function(req,res){

res.redirect("/");

})
app.listen(process.env.PORT||4000,function(res,req){


console.log("the server starts at port 4000");


})
// api key for mailclip
// 1549afc3cbee6805b0301cf84f171a00-us20

// id
// 13b820e474
