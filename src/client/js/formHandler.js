const updateIndex = require('./updateIndex.js');

// Function that sets the whole server path to a relative API path
const queryLocalServer = (path) => {
  if (process.env.NODE_ENV === 'production') {
    const localhost = `http://localhost:${process.env.PORT_PROD}`;
    return new URL(path, localhost);
  }
  if (process.env.NODE_ENV === 'development') {
    const localhost = `http://localhost:${process.env.PORT_DEV}`;
    return new URL(path, localhost);
  }
  return null;
};

/*
  The URL that is submitted by the user in the form is sent to the server.
*/
const postUserInput = async (url, data = {}) => {
  await fetch(url, {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).catch((error) => {
    updateIndex.resetView();
    updateIndex.removeSpinner();
    document.getElementById('results').insertAdjacentHTML('beforeEnd', updateIndex.getServerErrorMessage());
    console.error('the following error occured: ', error.message);
  });
};

/*
  The sentiment analysis is received from the server.
*/
const getProjectData = async () => {
  const res = await fetch(queryLocalServer('/api/getProjectData'));
  try {
    const response = await res.json();

    // Previously received results are removed.
    updateIndex.resetView();

    // After getting a response the spinner is removed.
    updateIndex.removeSpinner();

    // The results are displayed.
    updateIndex.updateResults(response);
  } catch (error) {
    updateIndex.resetView();
    updateIndex.removeSpinner();
    document.getElementById('results').insertAdjacentHTML('beforeEnd', updateIndex.getServerErrorMessage());
    console.error('the following error occured: ', error.message);
  }
};

// This function checks if a URL contains invalid characters.
// The regex expression is taken from Diego Perini (https://gist.github.com/dperini/729294)
const validateURL = (url) => {
  const regEx = new RegExp(
    '^'
      // protocol identifier (optional)
      // short syntax // still required
      + '(?:(?:(?:https?|ftp):)?\\/\\/)'
      // user:pass BasicAuth (optional)
      + '(?:\\S+(?::\\S*)?@)?'
      + '(?:'
        // IP address exclusion
        // private & local networks
        + '(?!(?:10|127)(?:\\.\\d{1,3}){3})'
        + '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})'
        + '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})'
        // IP address dotted notation octets
        // excludes loopback network 0.0.0.0
        // excludes reserved space >= 224.0.0.0
        // excludes network & broadcast addresses
        // (first & last IP address of each class)
        + '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])'
        + '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}'
        + '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))'
      + '|'
        // host & domain names, may end with dot
        // can be replaced by a shortest alternative
        // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
        + '(?:'
          + '(?:'
            + '[a-z0-9\\u00a1-\\uffff]'
            + '[a-z0-9\\u00a1-\\uffff_-]{0,62}'
          + ')?'
          + '[a-z0-9\\u00a1-\\uffff]\\.'
        + ')+'
        // TLD identifier name, may end with dot
        + '(?:[a-z\\u00a1-\\uffff]{2,}\\.?)'
      + ')'
      // port number (optional)
      + '(?::\\d{2,5})?'
      // resource path (optional)
      + '(?:[/?#]\\S*)?'
    + '$', 'i',
  );
  if (url.match(regEx)) {
    return true;
  }
  return false;
};

/*
  A URL is going to be submitted to the MeaningCloud API service. The following
  function validates user input and carries out feedback if the input
  is not valid. This function is adapted from the Bootstrap Starter code
  (https://getbootstrap.com/docs/4.6/components/forms/#validation).
  Furthermore a more in-depth check of the URL is provided by validateURL().
*/
const submitURL = (event) => {
  // If a result is already shown the view gets reset.
  updateIndex.resetView();
  const forms = document.getElementsByClassName('needs-validation');
  Array.prototype.filter.call(forms, (form) => {
    const apiRequestUrl = document.getElementById('url-input').value;
    // The form validation checks, if a url including protocol is submitted.
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (form.checkValidity() === true) {
      event.preventDefault();

      // The spinner is shown to feedback the loading process.
      updateIndex.showSpinner();

      /*
        Additional feedback is provided if the URL is formally correct but contains
        invalid characters.
      */
      if (validateURL(apiRequestUrl) === false) {
        updateIndex.removeSpinner();
        document.getElementById('results').insertAdjacentHTML('beforeEnd', updateIndex.getUserErrorMessage());
      }

      if (validateURL(apiRequestUrl) === true) {
        postUserInput(queryLocalServer('/api/postUserInput'), { apiRequestUrl })
          .then(
          // After receiving data from the server, the result is displayed.
            getProjectData(),
          );
        // If loading takes too long, a message is displayed.
        updateIndex.getLoadingMessage();
      }
    }
    form.classList.add('was-validated');
  });
};

export { postUserInput };
export { submitURL };
export { validateURL };
