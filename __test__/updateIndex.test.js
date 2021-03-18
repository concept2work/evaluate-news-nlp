import { getServerErrorMessage } from '../src/client/js/updateIndex';

describe('Testing if error messages are given back.', () => {
  test('Testing an incorrect URL with a space', () => {
    const error = 'custom error message';
    expect(getServerErrorMessage(error)).toMatch(/custom error message/);
  });
});
