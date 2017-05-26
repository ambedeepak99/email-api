Welcome to Email Sender (Frontend) !
===================


This web application facilitated to send emails to users

----------
Getting Started
-------------

To get you started you can simply clone the email-sender repository and install the dependencies:

**Prerequisites**

We also use a number of Node.js tools to initialize and test email-sender. You must have Node.js and its package manager (npm) installed. You can get them from [here](https://nodejs.org/en/).


**Install Dependencies**

We have two kinds of dependencies in this project: tools and Angular framework code. The tools help us manage and test the application.

**Note:**

 - Install xampp in your local machine, you can get xampp from [here](https://www.apachefriends.org/index.html)
 - Refere [this](http://www.wikihow.com/Install-XAMPP-for-Windows) step to install xampp in your local machine


Install grunt dependancy from package.json
```sh
$ npm install
```

You should find out that you have two new folders in your project.
node_modules - contains the npm packages for the tools we need


**Run the Application**

Install grunt dependancy from package.json
```sh
$ npm install
```
Once grunt installed then you can run following command to deployed project [dist]
```sh
$ grunt     (deployed project)
$ grunt watch  (It will watch changes in project and deploy project if changes found)
```

**Install xampp server**

1. Check, [Download link](https://www.apachefriends.org/index.html)

2. copy paste application dist folder into xampp\htdocs\CREATE_PROJECT_FOLDER folder. 

3. run xampp server using xampp console.

4. type in browser, http://localhost/PROJECT_FOLDER/dist
