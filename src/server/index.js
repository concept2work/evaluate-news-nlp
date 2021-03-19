// Dotenv is used to read values from the .env file
const dotenv = require('dotenv');

// Node fetch is required to query the external API via fetch()
const fetch = require('node-fetch');

// Express is used to run server and routes.
const express = require('express');

// Body-parser is used as middle-ware.
const bodyParser = require('body-parser');

// Cors is used for cross origin allowance.
const cors = require('cors');

// Text responses from the server are integrated in an external module.
const serverMessage = require('./lib/serverMessage.js');

// An instance of app is started.
const app = express();

/*
  Empty JS objects act as endpoints for the routes regarding request and response data
  to/from the server.
*/
let requestData = {};
let responseData = {};

app.use(express.static('dist'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

dotenv.config();

const apiKey = process.env.API_KEY;
const apiURI = 'api.meaningcloud.com/sentiment-2.1';

// The home page routes
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile('dist/index.html');
  }
  if (process.env.NODE_ENV === 'development') {
    res.redirect(301, `http://localhost:${process.env.PORT_DEV}`);
  }
});

// Function and route to handle the provided URL from the client.
const postUserInput = (req, res) => {
  requestData = {
    apiRequestUrl: req.body.apiRequestUrl,
  };
};
app.post('/api/postUserInput', postUserInput);

// Function to query the MeaningCloud API
const getTextInformation = async (uri) => {
  const res = await fetch(uri);
  console.log(`getTextInformation uri:${uri}`);
  try {
    // If the API sends OK, text information is returned.
    if (res.ok) {
      const textInfo = await res.json();
      return textInfo;
    }
    /*
      In any other case an error message is displayed to the user.
      The error message is retrieved from the API to provide a meaningful
      error message to the user.
    */
    if (!res.ok) {
      // Todo: error handling
      const errorData = await res.json();
    }
  } catch (error) {
    console.error('the following error occured: ', error.message);
  }
  return null;
};

// Route to provide the client with the processed information from the MeaningCloud API
app.get('/api/getProjectData', (req, res) => {
  const apiRequest = `https://${apiURI}?key=${apiKey}&lang=auto&url=${requestData.apiRequestUrl}`;
  getTextInformation(apiRequest)
    .then((textInfo) => {
      if (textInfo.status.code === '0') {
        responseData = {
          score_tag: serverMessage.evaluateResponseData(textInfo.score_tag),
          agreement: serverMessage.evaluateResponseData(textInfo.agreement),
          subjectivity: serverMessage.evaluateResponseData(textInfo.subjectivity),
          confidence: serverMessage.evaluateResponseData(textInfo.confidence),
          irony: serverMessage.evaluateResponseData(textInfo.irony),
        };
      }
      if (textInfo.status.code !== '0') {
        responseData = {
          error: serverMessage.getErrorMessage(textInfo.status.msg),
        };
      }
      res.send(responseData);
    });
});

/*
  Depending on whether development or production is used, the port varies.
  The specific value is read from the environment file.
*/
const getPort = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.PORT_PROD;
  }
  if (process.env.NODE_ENV === 'development') {
    return process.env.PORT_DEV_PROXY;
  }
  return null;
};

// The port can vary and is retrieved with the getPort() function.
app.listen(getPort(), () => {
  console.log(`server is running on localhost:${getPort()}`);
});
