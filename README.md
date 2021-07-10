A simple API REST application built in nodejs, using express and mongodb.

## Getting Started

In order to run the app, you need to install all dependencies first (they are listed in package.json).
For this, you must have installed [*npm*](https://docs.mongodb.com/guides/server/install/) and [*mongodb*](https://docs.mongodb.com/guides/server/install/).


## Run the app



### In the mongoose folder:

To install the dependencies:
```

npm install

```
After install all packages, run:

```

npm start

```
Wait a few seconds that the browser open and the application is ready.
It's running at **http://localhost:3000/**.

## Endpoints

 ```
 POST auth/login      body: {email, password}
 POST auth/sign-up    body: {email, name, password}
 ```

## Run unit tests


### In the mongoose folder:

```

npm run test

```

## Built With



* [ExpressJS](https://expressjs.com/)

* [Mongoose](https://mongoosejs.com/)

* [MongoDB](https://www.mongodb.com/)
