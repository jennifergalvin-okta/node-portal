
This package has some requirements, in the same directory as the app, go ahead and install the requirements with this command line

npm install http https express body-parser pug

Move the okta_config.json.example file to okta_config.json and add your tenant and API key.  If you are committing this back to git or anywhere else do NOT commit this file to your public repository!

Then you can run it from a command line:

node server.js

This server defaults and listens on port 443 https (but is configurable in server.js).  If you want to run it on a permanent server, you can combine this commane with a nohup and a background &, or install the "screen" command and then run it in a screen and detach it.
