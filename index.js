'user stricts'
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.set('port',(process.env.port || 5000));

//alows to process data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//routes
app.get('/', function(req, res) {
    res.send('Hi I am chatbot');
});

//Fb
app.get('/webhook/', function(req, res){
   if(req.query['hub.varify_token'] === "blondibytes"){
       res.send(req.query['hub.challange']);
   } 
   res.send("Wrong toen");
});

app.listen(app.get('port'), function(){
    console.log('Running : port');
});