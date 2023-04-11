import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

Meteor.startup(() => {
  // Code to run on server at startup

  WebApp.connectHandlers.use('/', (req, res, next) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to the MeteorJS app!');
  } else {
    next();
  }
});


  // Define a middleware function to handle incoming POST requests
  WebApp.connectHandlers.use('/post-endpoint', (req, res, next) => {
    if (req.method === 'POST') {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        console.log('Received POST data:', body);

        // Send a response
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('POST request received');
      });
    } else {
      // Allow other request methods to pass through
      next();
    }
  });
});
