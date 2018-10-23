

const userPath = 'assets/user.txt';
const tweetPath = 'assets/tweet.txt';

test('application execution', () => {
  const args = '';
  expect(require('../src/')({_: [], user:'assets/user.txt', tweet:'assets/tweet.txt' })).toBe();
});
