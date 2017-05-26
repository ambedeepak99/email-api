Welcome to Email API!
===================

Problem Statement
----

Create a service that accepts the necessary information and sends emails. It should provide an abstraction between two different email service providers. If one of the services goes down, your service can quickly failover to a different provider without affecting your customers.

**Example Email Providers**:

 - [SendGrid](https://sendgrid.com/) - Simple Send Documentation
 - [Mailgun](https://www.mailgun.com/) - Simple Send Documentation
 - [SparkPost](https://www.sparkpost.com/) - Developer Hub
 - [Amazon SES](https://aws.amazon.com/ses/) - Simple Send Documentation

You need to have Node, NPM(Node Package Manager) and MongoDb installed on your machine.

**For Node and NPM**: Please follow this [article](https://docs.npmjs.com/getting-started/installing-node)
**For MongoDb**: Please follow this [article](https://docs.mongodb.com/getting-started/shell/installation/)

**Features**:
Project have the following functionalities:

 - Signin and Signup for the users
 - Token based API authentication
 - Auto sending in case all of the external API fails
 - Server activity logs


To view Project Documentation, you need to place the folder server/api.document to root folder of web sevrer.
e.g. If your web server is running on www.example.com in /var/www/html folder, then place api.document in /var/www/html/api.document, so that you can view documentation on www.example.com/api.document.


---------

Client
----

The client has frontend for sending mails, in which following modules are used:
**Modules used**:

 - Angularjs
 - Bootstrap
 - Grunt

For documentation:

- jsdocs

Server
----

The server has the backend that is mail sending api, in which the following modules are used:
**Modules used**:

 - Nodejs (expressjs framework)
 - Mongodb
 - Grunt

**Mail API used**:

 - [Mailgun](https://www.mailgun.com/)
 - [SparkPost](https://www.sparkpost.com/)
 - [Nodemailer](https://www.npmjs.com/package/nodemailer)

For documentation:

 - jsdocs
