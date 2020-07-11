//This is still work in progress
/*
Please report any bugs to nicomwaks@gmail.com
i have added console.log on line 48 
 */
'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const dotenv= require('dotenv');
dotenv.config({path: './config.env'}); 
const app = express()

console.log('in applicatoin');
console.log('in applicatoin');
console.log('in applicatoin');

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())
const token = process.env.PAGE_ACCESS_TOKEN;
// index
app.get('/', function (req, res) {
	res.send(`hello world i am a secret bot ${token} ${process.env.MY_VERYFY_FB_TOKEN}`);
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === process.env.MY_VERYFY_FB_TOKEN) {
		console.log('Mssgnder calling me');
		res.send(req.query['hub.challenge'])
	} else {
		res.send('Error, wrong token');
	}
})

// to post data
app.post('/webhook/', function (req, res) {
	console.log('My fb app');
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i];
		console.log('Got the messgae: ',event.message.text);
		console.log('sender',event.sender);
		let sender = event.sender.id;
		if (event.message && event.message.text) {
			let text = event.message.text
			console.log(text);
			if (text === 'Generic'){ 
				console.log("welcome to chatbot")
				//sendGenericMessage(sender)
				continue
			}
			sendTextMessage(sender, "Welcome to theBase! Your message is important to us. We will get back to you soon. Your message:\n " + text.substring(0, 200)+" \nwill be taken care!");
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
	}
	res.sendStatus(200)
});



// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.FB_PAGE_ACCESS_TOKEN


function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}


// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})