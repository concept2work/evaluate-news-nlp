const serverMessage = require('../src/server/lib/serverMessage.js');

describe('Testing if server messages are given back.', () => {
  test('Testing if a error message including the error is sent back', () => {
    const inputValue = 'error';
    expect(serverMessage.getErrorMessage(inputValue)).toMatch(/error/);
  });
});
