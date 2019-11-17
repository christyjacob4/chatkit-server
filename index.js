  require('dotenv').config({ path: '.env' });

    const express = require('express');
    const bodyParser = require('body-parser');
    const cors = require('cors');
    const Chatkit = require('@pusher/chatkit-server');

    const app = express();

    const chatkit = new Chatkit.default({
      instanceLocator: "v1:us1:56165286-1172-4484-9d35-1e8bb8d98038",
      key: "44cc9003-f25c-4f2e-afb5-30d6fe0e2846:RuLQQx9hvL/Sd8Z/0nzCyLC99YeoQDfrBGINirKc9os=",
    });

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.post('/users', (req, res) => {
      const { userId } = req.body;

      chatkit
        .createUser({
          id: userId,
          name: userId,
        })
        .then(() => {
          res.sendStatus(201);
        })
        .catch(err => {
          if (err.error === 'services/chatkit/user_already_exists') {
            console.log(`User already exists: ${userId}`);
            res.sendStatus(200);
          } else {
            res.status(err.status).json(err);
          }
        });
    }); 

    app.post('/authenticate', (req, res) => {
      const authData = chatkit.authenticate({
        userId: req.query.user_id,
      });
      res.status(authData.status).send(authData.body);
    });

    app.set('port', 5200);
    const server = app.listen(app.get('port'), () => {
      console.log(`Express running → PORT ${server.address().port}`);
    });