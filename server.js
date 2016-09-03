var https = require('https');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('static'));

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/register', function (req, res) {
   res.sendFile( __dirname + "/" + "register.html" );
})

app.post('/register', urlencodedParser, function (req, res) {
  
  // Prepare output in JSON format
  response = 
  {
	firstName:req.body.firstName,
	lastName:req.body.lastName,
	mobilePhone:req.body.mobilePhone,
	emailAddress:req.body.emailAddress,
	state:req.body.state
	
  }
  console.log(response);
  res.end(JSON.stringify(response));

  // Insert the user into Okta

    var config = require('./okta_config.json');
    var postHeaders =
    {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'Authorization' : "SSWS " + config.apikey
    };


    var options = {
    	host : config.host, // here only the domain name
    	// (no http/https !)
    	port : 443,
    	path : '/api/v1/users?activate=true', // the rest of the url with parameters if needed
    	method : 'POST',
	headers:  postHeaders
    };

    var userObject = JSON.stringify(
    {
        "profile":
	{
	   "firstName": req.body.firstName,
	   "lastName": req.body.lastName,
	   "email": req.body.emailAddress,
	   "login": req.body.emailAddress
	}
    });

    // do the POST call
    var reqPost = https.request(options, function(res) {
        console.log("statusCode: ", res.statusCode);
        // uncomment it for header details
        //  console.log("headers: ", res.headers);
 
        res.on('data', function(d) {
            console.info('POST result:\n');
            process.stdout.write(d);
            console.info('\n\nPOST completed');
        });
    });
 
    // write the json data
    reqPost.write(userObject);
    reqPost.end();
    reqPost.on('error', function(e) {
        console.error(e);
    });


})


app.get('/storefront', function (req, res) {
  res.sendFile( __dirname + "/" + "storefront.hml" );

})
  

var server = app.listen(8082, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})

