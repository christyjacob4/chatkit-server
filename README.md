# Authentication Server for Chatkit-Client
This is the authentication server required by the chat service of Workspaces.
It is currently hosted on Heroku at https://agile-stream-37836.herokuapp.com/ 


# Steps to run

* ### Clone the repository 
```
git clone https://github.com/christyjacob4/chatkit-server
cd chatkit-server
```

* ### Install the packages 
```
npm install
```

* ### Install heroku-cli 
```
sudo snap install --classic heroku
```

* ### Login to Heroku 
```
heroku login
```

* ### Create a heroku project 
```
heroku create
```

* ### Push to heroku 
```
git push heroku master
```

Pushing to the master branch of the heroku remote, triggers a build and automatically hosts the latest version of your code.