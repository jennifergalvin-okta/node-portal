var http = require('http');
var https = require('https');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pug = require('pug');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('view engine', 'pug');
app.set('views', __dirname + '/views')


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
	alternateEmailAddress:req.body.alternateEmailAddress,
	
  }
  //console.log(response);

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
	   "secondEmail": req.body.alternateEmailAddress,
	   "login": req.body.emailAddress
	}
    });

    // do the POST call
    var reqPost = https.request(options, function(res) {
	console.log("headers: ", res.headers);
        console.log("statusCode: ", res.statusCode);
	
        res.on('data', function(d) {
            console.info('POST result:\n');
            process.stdout.write(d);
            console.info('\n\nPOST completed');
        });
    });
 
    // write the json data
    reqPost.write(userObject);
    reqPost.end();

    var renderData = {}
    if (res.statusCode == 200)  {
  	renderData = {
		title:  'Registration Succeeded',
		message:  '<br>User ' + req.body.emailAddress + ' was registered successfully.  <br>Navigate <a href="http://portal.galvin.ninja">here</a> to sign in.'
    	}
    }

    reqPost.on('error', function(e) {
        console.error(e);
  	renderData = {
		title:  'Registration Failed',
		message:  '<br>User ' + req.body.emailAddress + ' was not registered successfully, the error message was:  ' + e
	}
    });
 
    
  res.render('results', renderData)

})

app.get('/storefront', function (req, res) {
  res.sendFile( __dirname + "/" + "storefront.html" );

})

app.post('/storefront', function (req, res) {
  res.sendFile( __dirname + "/" + "storefront.hml" );
})


var serverOptions = {
  key: fs.readFileSync('/etc/pki/tls/private/server.key'),
  cert: fs.readFileSync('/etc/pki/tls/certs/server.crt')
};

http.createServer(app).listen(80);
https.createServer(serverOptions, app).listen(443);
