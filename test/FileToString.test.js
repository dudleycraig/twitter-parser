const FileToString = require('../src/FileToString');
const fs = require('fs');

const userPath = 'assets/user.txt';
const userFileToString = new FileToString(userPath);
const userString = `Ward follows Alan
Alan follows Martin
Ward follows Martin, Alan
`;

const tweetPath = 'assets/tweet.txt';
const tweetFileToString = new FileToString(tweetPath);
const tweetString = `Alan> If you have a procedure with 10 parameters, you probably missed some.
Ward> There are only two hard things in Computer Science: cache invalidation, naming things and off-by-1 errors.
Alan> Random numbers should not be generated with a method chosen at random.
`;

test('constructor returns instance of FileToString', () => {
  expect(new FileToString(userPath)).toBeInstanceOf(FileToString);
});

it('pathToBuffer() returns raw file content', () => {
  expect.assertions(1);
  return expect(userFileToString.pathToBuffer()).resolves.toBeInstanceOf(Buffer);
});

it('statsFromBuffer() returns file stats', () => {
  expect.assertions(1);
  return expect(userFileToString.statsFromBuffer()).resolves.toBeInstanceOf(fs.Stats);
});

test('validateBuffer() returns raw file content', () => {
  expect(userFileToString.validateBuffer()).toBeInstanceOf(Buffer);
});

it('getContents() returns string representation of user file', () => {
  expect.assertions(1);
  return expect(userFileToString.getContents()).resolves.toEqual(userString);
});

