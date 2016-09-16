
This package has some requirements, in the same directory as the app, go ahead and install the requirements with this command line

npm install http https express body-parser pug

Move the okta_config.json.example file to okta_config.json and add your tenant and API key (this is only for the administrative functions like registering user, etc).  If you are committing this back to git or anywhere else do NOT commit this file to your public repository!

Customize your landing page by altering your widget in index.html (this file is served as is, so you can update it with your tenant and update the javascript widget versions yourself over time)

At the bottom of server.js, it specifies where the certificates for ssl live:

// Change your ports and certificate/key for SSL here
/*
var serverOptions = {
  key: fs.readFileSync('/etc/pki/tls/private/server.key'),
  cert: fs.readFileSync('/etc/pki/tls/certs/server.crt')
};
*/

Specify your certificates, and then you can run the portal in SSL mode by altering the lines below:
http.createServer(app).listen(80);
//https.createServer(serverOptions, app).listen(443);

Then you can run it from a command line:

node server.js

This server defaults and listens on port 443 https (but is configurable in server.js).  If you want to run it on a permanent server, you can combine this commane with a nohup and a background &, or install the "screen" command and then run it in a screen and detach it.
