import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import models from './models/index.js'; // add /index.js?
import routes from './routes/index.js';

const app = express();

app.use(cors());

// ALL INFO/PAYLOADS IN JSON
app.use(express.json()); // transform json
app.use(express.urlencoded({ extended: true })); // transform urlencoded body types

// CREATING OUR OWN MIDDLEWARE
// when creating a message on the message post API, we need to authenticate the user
app.use((req, res, next) => {
  // req.me = users[1]; // before we moved data to models dir
  req.context = { // dedicated context object...
    models, // that passes the models to all routes
    me: models.users[1], // also pass the authenticated user
  };
  next();
});

// ROUTES
app.use('/session', routes.session);
app.use('/users', routes.user); // /users URI defined here 
// so we don't have to have it in the routes dir elsewhere
app.use('/messages', routes.message);

// All below was moved to route directories
// // dedicated route for the authenticated user resource (from our own middleware above)
// // offer an endpoint for a specific feature (not RESTful, but RESTish)
// app.get('/session', (req, res) => {
//   return res.send(req.context.models.users[req.context.me.id]);
// });

// app.get('/users', (req, res) => {
//   return res.send(Object.values(req.context.models.users));
// });

// app.get('/users/:userId', (req, res) => {
//   return res.send(req.context.models.users[req.params.userId]);
// });

// app.get('/messages', (req, res) => {
//   return res.send(Object.values(req.context.models.messages));
// });

// app.get('/messages/:messageId', (req, res) => {
//   return res.send(req.context.models.messages[req.params.messageId]);
// });

// app.post('/messages', (req, res) => {
//   const id = uuidv4();
//   const message = {
//     id,
//     text: req.body.text,
//     userId: req.context.me.id,
//   };

//   req.context.models.messages[id] = message;

//   return res.send(message);
// });

// app.delete('/messages/:messageId', (req, res) => {
//   const {
//     [req.params.messageId]: message,
//     ...otherMessages
//   } = req.context.models.messages;

//   req.context.models.messages = otherMessages;

//   return res.send(message);
// });

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);


// STEPS IN API DEVELOPMENT

// 1. 
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// 2. REST APIs use HTTP methods (and we added other CRUDs)

// app.get('/', (req, res) => {
//   return res.send('Received a GET HTTP method');
// });
// app.post('/', (req, res) => {
//   return res.send('Received a POST HTTP method');
// });
// app.put('/', (req, res) => {
//   return res.send('Received a PUT HTTP method');
// });
// app.delete('/', (req, res) => {
//   return res.send('Received a DELETE HTTP method');
// });

// 3. REST APIs act as resources (not just root URI '/', we add /users)

// app.get('/users', (req, res) => {
//   return res.send('GET HTTP method on user resource');
// });
// app.post('/users', (req, res) => {
//   return res.send('POST HTTP method on user resource');
// });
// app.put('/users/:userId', (req, res) => {
//   return res.send('PUT HTTP method on user resource');
// });
// app.delete('/users/:userId', (req, res) => {
//   return res.send('DELETE HTTP method on user resource');
// });

// 4. We also need to change PUT and DELETE with updated resources

// app.put('/users/:userId', (req, res) => {
//   return res.send(
//     `PUT HTTP method on user/${req.params.userId} resource`,
//   );
// });
// app.delete('/users/:userId', (req, res) => {
//   return res.send(
//     `DELETE HTTP method on user/${req.params.userId} resource`,
//   );
// });

// 5. Using actual users and messages data (res.send)

// app.get('/users', (req, res) => {
//   return res.send(Object.values(users));
// });
// app.get('/users/:userId', (req, res) => {
//   return res.send(users[req.params.userId]);
// });

// 6. POST messages example
// app.post('/messages', (req, res) => {
//   const id = uuidv4(); // generates unique id (since we don't have a db yet)
//   const message = {
//     id,
//     text: req.body.text,
//   };
//   messages[id] = message;
//   return res.send(message);
// });

// 7. REST APIs are STATELESS
// session state in this example is authenticated user (provided to every route in express application)
// Create middleware above that authenticates user (req.me = users[1];)

// app.post('/messages', (req, res) => {
//   const id = uuidv4();
//   const message = {
//     id,
//     text: req.body.text,
//     userId: req.me.id, // this is what we added, the authenticated user
//   };
//   messages[id] = message;
//   return res.send(message);
// });

// 8. Updated DELETE

// app.delete('/messages/:messageId', (req, res) => {
//   const {
//     [req.params.messageId]: message,
//     ...otherMessages // exclude deleted message from messages object
//   } = messages;
//   messages = otherMessages; //update messages object
//   return res.send(message);
// });

// 9. MOVE MODELS OUT OF APIs: Update middleware to get models data from import instead of outside variable
// So we use the models and authenticated user from the functions' argument
// I showed the before and after only for the first one

// BEFORE
// app.get('/session', (req, res) => {
//   return res.send(users[req.me.id]); // #NOT UPDATED
// });
// AFTER
// app.get('/session', (req, res) => {
//   return res.send(req.context.models.users[req.context.me.id]); // #UPDATED
// });

// app.get('/users', (req, res) => {
//   return res.send(Object.values(req.context.models.users)); // #UPDATED
// });
// app.get('/users/:userId', (req, res) => {
//   return res.send(req.context.models.users[req.params.userId]); // #UPDATED
// });
// app.get('/messages', (req, res) => {
//   return res.send(Object.values(req.context.models.messages)); // #UPDATED
// });
// app.get('/messages/:messageId', (req, res) => {
//   return res.send(req.context.models.messages[req.params.messageId]); // #UPDATED
// });
// app.post('/messages', (req, res) => {
//   const id = uuidv4();
//   const message = {
//     id,
//     text: req.body.text,
//     userId: req.context.me.id, // #UPDATED
//   };
//   req.context.models.messages[id] = message; // #UPDATED
//   return res.send(message);
// });
// app.delete('/messages/:messageId', (req, res) => {
//   const {
//     [req.params.messageId]: message,
//     ...otherMessages
//   } = req.context.models.messages; // #UPDATED
//   req.context.models.messages = otherMessages; // #UPDATED
//   return res.send(message);
// });

// 10. MOVE ROUTES OUT OF APIs