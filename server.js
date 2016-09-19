// Dependencies
// Get these by running "npm install http https fs express body-parser pug"

var http = require('http');
var https = require('https');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pug = require('pug');

// Require the config file
// An example config file is included in this package for you as okta_config.json.example
var config = require('./okta_config.json');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// We will use pug as our template engine for create user responses
app.set('view engine', 'pug');
app.set('views', __dirname + '/views')

app.use(express.static('static'));

// Route for / - default page
// sends the contends of index.html
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})


// Sends the contends of index.html
app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

// First part of Registration - sends the contents of register.html
app.get('/register', function (req, res) {
   res.sendFile( __dirname + "/" + "register.html" );
})

// Post of registration
// This grabs the inputs from register.html (you must define them both there and here) and then parses them, and sends them to Okta
app.post('/register', urlencodedParser, function (req, res, next) {
  
  // Figure out what we got
  response = 
  {
	firstName:req.body.firstName,
	lastName:req.body.lastName,
	mobilePhone:req.body.mobilePhone,
	email:req.body.email,
	secondEmail:req.body.secondEmail
	
  }
  console.log(response.body);

  // Insert the user into Okta
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
	   "email": req.body.email,
	   "secondEmail": req.body.secondEmail,
	   "login": req.body.email
	}
  });

    // do the POST call to Okta if we're in write mode
    if (config.appMode.indexOf("w") != -1)
    {
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
	
    }

    //  Here we use the template engine pug, as our results page is basically the same, except for the title and the error messages
    var renderData = {}
    if (config.appMode.indexOf("w") == -1)
    {
	renderData = {
                title:  'Registration Succeeded',
                message:  '<br>User ' + req.body.emailAddress + ' was registered successfully.  <br>Navigate <a href="' + config.appMain + '">here</a> to sign in.'
        }

    }
    else
    {
    	if (res.statusCode == 200) 
    	{
  		renderData = 
		{
			title:  'Registration Succeeded',
			message:  '<br>User ' + req.body.emailAddress + ' was registered successfully.  <br>Navigate <a href="' + config.appMain + '">here</a> to sign in.'
    		}

    		reqPost.on('error', function(e) 
		{
        		console.error(e);
        		renderData = 
			{
                		title:  'Registration Failed',
                		message:  '<br>User ' + req.body.emailAddress + ' was not registered successfully, the error message was:  ' + e
        		}
    		});

    	}
    }


  // Here we render the results on the template in view/results.pug.  Changing the messages above will change the content, and changing the 
  // template file view/results.pug will change the look and feel
  res.render('results', renderData)

})

// Successful login langing page, sends contents of storefront.html
app.get('/storefront', function (req, res) {
  res.sendFile( __dirname + "/" + "storefront.html" );

})

// Successful login langing page, sends contents of storefront.html
app.post('/storefront', function (req, res) {
  res.sendFile( __dirname + "/" + "storefront.hml" );
})

// Run the Server
if (config.listenOnHTTP != "true")
	{ console.log("Not configured to listen on http in config file."); }
else
{ 
	http.createServer(app).listen(config.httpPort); 
	console.log("Server listening on port " + config.httpPort);
}

// Set SSL options here
if (config.listenOnHTTPS != "true")
	{ console.log("Not configured to listen on https in config file."); }
else
{
	var serverOptions = {
  		key: fs.readFileSync(config.sslKey),
  		cert: fs.readFileSync(config.sslCert)
	};
	https.createServer(serverOptions, app).listen(config.httpsPort); 
	console.log("SSL Server listening on port " + config.httpsPort);
}


