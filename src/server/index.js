/* eslint-disable max-len */
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

// An instance of app is started.
const app = express();

/*
  Middleware to process timeouts
*/
const timeout = require('connect-timeout');

// Text responses from the server are integrated in an external module.
const serverMessage = require('./lib/serverMessage.js');

// Library that allows the use of environment variables
dotenv.config();

/*
  Empty JS objects act as endpoints for the routes regarding request and response data
  to/from the server.
*/
let requestData = {};
let responseData = {};

// MeaningCloud specific values
const apiKey = process.env.API_KEY;
const apiURI = 'api.meaningcloud.com/sentiment-2.1';

/*
  Setting a timeout of 120 seconds (server standard time) for feedback
  purposes in specific routes.
*/
const serverTimeOut = '120s';

app.use(express.static('dist'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(timeout(serverTimeOut));

// The home page routes are specified depending on mode
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile('dist/index.html');
  }
  if (process.env.NODE_ENV === 'development') {
    res.redirect(301, `http://localhost:${process.env.PORT_DEV}`);
  }
});

// Handling of the URL from the client that is to be processed by MeaningCloud.
const postUserInput = (req, res) => {
  requestData = {
    apiRequestUrl: req.body.apiRequestUrl,
  };
};
app.post('/api/postUserInput', postUserInput);

// Function to query the MeaningCloud API
const getTextInformation = async (uri) => {
  const res = await fetch(uri);
  console.log(`get Info from MeaningCloud API: ${uri}`);
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
      const errorData = await res.json();
    }
  } catch (error) {
    console.error('the following error occured: ', error.message);
  }
  return null;
};

// Route to provide the client with the processed information from the MeaningCloud API
app.get('/api/getProjectData', (req, res, next) => {
  /*
    A process for handling timeouts is included since responses from the
    MeaningCloud API can take a long time depending on the contents on the
    analyzed website. The solution including the handling of timed out requests
    is adapted from John Au-Yeung
    (https://medium.com/dataseries/add-timeout-capability-to-express-apps-with-connect-timeout-fce06d76e07a)
  */
  // If the request is taking too long, it is timed out and error handling is provided.
  if (req.timedout) {
    next();
  } else {
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
            error: serverMessage.getErrorMessageApi(textInfo.status.msg),
          };
        }
        res.send(responseData);
      });
  }
});

// Error handling
app.use((err, req, res, next) => {
  if (res.status(504)) {
    /*
      Workaround to reset timeout adapted from Arup Rakshit
      (https://stackoverflow.com/questions/55364401/express-js-connect-timeout-vs-server-timeout)
    */
    req.socket.removeAllListeners('timeout');
    // Sending a timeout specific error message to the client
    responseData = {
      error: serverMessage.getErrorMessageServer(),
    };
    res.send(responseData);
  }
  next();
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
