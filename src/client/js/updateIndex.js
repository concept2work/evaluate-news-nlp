// The function displays a loading spinner
const showSpinner = () => {
  document.getElementById('loading-status').className = 'd-flex justify-content-center pt-3 pb-3';
};

/*
  The function removes a previously invoked loading spinner.
  It is called when a result is displayed.
  */
const removeSpinner = () => {
  document.getElementById('loading-status').className = 'd-none';
};

/*
  List entries show results retrieved from the MeaningCloud API and error messages.
  With this function they can be removed. Solution adapted by Gabriel McAdams
  (https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript).
*/
const resetView = () => {
  const resultList = document.getElementById('results');
  while (resultList.firstChild) {
    resultList.removeChild(resultList.lastChild);
  }
};

/*
  A message is displayed when getting results from the MeaningCloud API
  takes longer than 10 seconds.
*/
const getLoadingMessage = () => {
  setTimeout(() => {
    const message = '<li class="list-group-item list-group-item-warning">Please have some patience, the sentiment analysis for longer texts takes a while.</li>';
    const results = document.getElementById('results');
    /*
    The message is only displayed if there are no results yet. This prevents that results that
    are retrieved before the timeout are overwritten.
  */
    if (!results.firstChild) {
      resetView();
      results.insertAdjacentHTML('beforeEnd', message);
    }
  }, 10000);
};

const updateResults = (response) => {
  // const responseObject = Object.entries(response);
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(response)) {
    document.getElementById('results').insertAdjacentHTML('beforeEnd', value);
  }
};

const getServerErrorMessage = (error) => {
  resetView();
  return `<li class="list-group-item list-group-item-danger">Sorry, there is no connection to the server at the moment. Please try again later. If the error persists please contact the website administrator and refer to the following error: <code>${error}</code></li>`;
};

const getUserErrorMessage = () => {
  resetView();
  return '<li class="list-group-item list-group-item-danger">The provided URL contains incorrect characters. Please check again.</li>';
};

// Necessary JavaScript to run Service Worker
const runServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js');
    });
  }
};

// Service Worker code is integrated for production mode only
const startServiceWorker = () => {
  if (process.env.NODE_ENV === 'production') {
    runServiceWorker();
  }
};
startServiceWorker();

export { showSpinner };
export { removeSpinner };
export { resetView };
export { updateResults };
export { getServerErrorMessage };
export { getUserErrorMessage };
export { getLoadingMessage };
