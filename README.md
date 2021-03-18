# Project: Evaluate a news article with Natural Language Processing for the Front End Web Developer Nanodegree Program

## Project goal
The project goal is to build a web tool that allows users to run Natural Language Processing (NLP) on website articles or blog entries. The processing is to be carried out via [MeaningCloud](https://www.meaningcloud.com) which provides an API to query. The app's functionality is to be worked out that the user interface is updated dynamically after the input of a website address that should be analyzed and showing a sentiment analysis of the content.

## Development procedure
The project is based on [Express](https://expressjs.com/) to provide a server where data is stored and retrievable by the app. To accomplish this, GET and POST server routes were provided for communication purposes with the app. The server retrieves and processes data from the MeaningCloud API and serves the information via specific routes. The app retrieves the information and updates the user interface with the received data from the Express server. Error handling is provided to give meaningful feedback in case something goes wrong. Furthermore the [webpack](https://webpack.js.org/) is used to generate different bundles for production and development.

## Resources
- The app's layout is based on [Bootstrap](https://getbootstrap.com).
- The app's index page uses an adaption of the [Sticky footer with fixed navbar template from the official Bootstrap web site](https://getbootstrap.com/docs/4.0/examples/sticky-footer-navbar/).
- The general JavaScript code structure is based on [Udacity's starter code](https://github.com/udacity/fend/tree/refresh-2019/projects/evaluate-news-nlp).

## Installation
Prerequisite is the installation of *node.js*. To install node.js follow the instructions on the [node.js website](https://nodejs.org/) for your operating system.

Use *npm* to install the required packes for the project. All necessary packages will be installed:
````
npm install
````

### Get a MeaningCloud API key
To get a working application it is necessary to obtain a free API key for the MeaningCloud Sentiment Analysis API. To do so, create an account on the [MeaningCloud website](https://www.meaningcloud.com/developer/sentiment-analysis).

### Include environment variables
The project uses a *.env* file to store necessary environment variables. This file is not provided via the project files so create it manually in the project root:
````
touch .env
````
Edit *.env* and enter the following lines:
````
API_KEY=<Your MeaningCloud API key>
PORT_DEV=3000
PORT_DEV_PROXY=4000
PORT_PROD=5000
````
In development mode `PORT_DEV` specifies the server's port, while `PORT_DEV_PROXY` specifiys a different port for a proxy since [DevServer](https://webpack.js.org/configuration/dev-server/) with [Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/) is used and therefore client and server must be located on different addresses. `PORT_PROD` specifies the production mode port. It is possible to change these values.

## Start of the application
It is possible to render a working home page for development and production mode.

### Development mode
It is necessary to start the express server for the backend and furthermore build the webpack bundle for the frontend. Use the following command to start the backend server:
````
npm run start-dev
````
In a new terminal window start generate the webpack development build for the client server:
````
npm run build-dev
````
Please note that both backend and backend server run on the same port. Requests from the client to the backend will be carried out via a proxy with a different port.

### Production mode
In production mode it is necessary to run a build first:
````
npm run build-prod
````
After that start the server and the client via:
````
npm run start-prod
````
You can open the application on localhost with your specified `PORT_PROD`, e. g. [localhost:5000](http://localhost:5000).