import { validateURL } from '../src/client/js/formHandler';

describe('Testing the response functionality for URL validation.', () => {
  test('Testing an incorrect URL with a space', () => {
    const url = 'http://www.google .com';
    expect(validateURL(url)).toBeFalsy();
  });
  test('Testing a correct URL', () => {
    const url = 'http://www.google.com';
    expect(validateURL(url)).toBeTruthy();
  });
});
