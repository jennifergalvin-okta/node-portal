var express = require('express');
var app = express();
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

app.post('/register', function (req, res) {


    var form = new formidable.IncomingForm();
  
    form.parse(req, function (err, fields, files) {
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');
        res.end(util.inspect({
            fields: fields,
            files: files
        }));
    });

/*
  // Prepare output in JSON format
  response = 
  {
	firstName:req.query.firstName,
	lastName:req.query.lastName,
	mobilePhone:req.query.mobilePhone,
	emailAddress:req.query.emailAddress,
	state:req.query.state
	
  }
  console.log(response);
  res.end(JSON.stringify(response));

*/

})


app.get('/storefront', function (req, res) {
  res.sendFile( __dirname + "/" + "storefront.hml" );

})
  

var server = app.listen(8082, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})

