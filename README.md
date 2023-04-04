# Node Task App

This is a [Node.js](https://nodejs.org/en) [Express](https://expressjs.com/) [TypeScript](https://www.typescriptlang.org/) backend application that will manage users and their tasks.

## Demo

API: https://node-task-app-yymw.onrender.com

For testing the APIs, you can use the API url above, with the [Postman calls](./postman/Tasks%20Manager.postman_collection.json).

## Quickstart

### Installation

To get this application up and running:

Clone this onto your system and install its dependencies:

```
yarn install
```

Add a `config` directory to the root of the project. 

Add a `dev.env` file to the `config` directory.

Ensure that the following environment variables are added:

```
PORT="[YOUR DESIRED PORT NUMBER]"
MONGODB_URL="[YOUR MONGODB CONNECTION URL]"
JWT_SECRET="[YOUR JWT SECRET]"
SENDGRID_API_KEY="[YOUR SENDGRID API KEY]"
FROM_EMAIL="[THE ADDRESS AUTOMATED EMAILS WILL BE SENT FROM]"
```

The `PORT` must be a 4-digit number. The convention is `3000`.

The `MONGODB_URL` will need to be the connection URL to your MongoDB database. Once you have a [MongoDB service](https://www.mongodb.com/) running locally, the convention is to use:

```
mongodb://127.0.0.1:27017/{your project name}
```

The `JWT_SECRET` can be whatever string you want it to be. One convention that I like is `"[YOUR_PROJECT][MONTH][YEAR]"`.

The `FROM_EMAIL` should ideally be tied to your [SendGrid.com](https://sendgrid.com/) account.



### Build the project

Build the `dist` directory by running:

```
yarn build
```

Get the dev environment running:

```
yarn dev
```

You should now see that the service is running locally in your terminal.


## Attribution

This template comes from the [Express](https://expressjs.com) [Hello world](https://expressjs.com/en/starter/hello-world.html) example on [Render](https://render.com).

The app in this repo is deployed at [https://express.onrender.com](https://express.onrender.com).

## Deployment

See https://render.com/docs/deploy-node-express-app or follow the steps below:

Create a new web service with the following values:
  * Build Command: `yarn install && npx tsc`
  * Start Command: `node dist/index.js`

That's it! Your web service will be live on your Render URL as soon as the build finishes.
