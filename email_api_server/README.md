Welcome to Node Email API!
===================

This api provides the functionalty to send the mail using different Email APIs. API first try to send emails by one API, if it fails then it try to send using other API and still it fails then it finally sends an emails using [nodemailer](https://www.npmjs.com/package/nodemailer).

----------


How to Deploy
----

You need to have Node, NPM(Node Package Manager) and MongoDb installed on your machine. If you don't have it the please run following commands:

**For Node and NPM**:
Please follow this [article](https://docs.npmjs.com/getting-started/installing-node)

**For MongoDb**:
Please follow this [article](https://docs.mongodb.com/getting-started/shell/installation/)

--------------------
**Deploy in Production**:
```sh
$ npm install --only=production
$ NODE_ENV=production nodemon bin/www
```

--------------------
**Deploy in Development**:

1.  Creating an environment variable named NODE_ENV, and setting it to 'development'.
2.  export NODE_ENV=development
 OR
3.  run the node app with following command
    ```NODE_ENV=development node app.js```
OR
4.  add to environment variable(For linux users)
    >* login as super user
        ```
        $ sudo -i
        $ gedit /etc/bash.bashrc
        ```
    >* write at the end of file
        ```
        NODE_ENV=development
        ```
    >* save file and close it


```sh
$ npm install
$ NODE_ENV=development nodemon bin/www
```

API will be running on the port 3000 by default.

-----------
We have used the jsdoc plugin of grunt for that you need to install [grunt](https://www.npmjs.com/package/grunt-cli) dev dependencies.

Just run the following command after installing grunt dependencies
```sh
$ grunt jsdoc
```

Please check the [postman collection](https://www.getpostman.com/collections/5b6183cf1d39c4e3eb55) to run the api.
