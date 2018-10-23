/**
 * 
 *
 */
const minimist = require('minimist');
const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');
const FileToString = require('../src/FileToString');

module.exports = (args = minimist(process.argv.slice(2))) => {
  const start = new Date().getTime();

  /** 
   * validate arguments
   * both --user and --tweet arguments are required
   *
   */
  const validate = args => {
    switch (false) {
      case (args.user): 
      case (args.tweet): 
        throw 'Both user and tweet 7-bit ascii files are required.';
      case (/.*(\.txt)$/.test(args.user)): 
      case (/.*(\.txt)$/.test(args.tweet)): 
        throw 'Invalid file extension, please use ".txt" for the required 7-bit ascii text files.';
    }
    return args;
  }

  /**
   * global error handler
   *
   */
  const handleError = error => {
    console.log(chalk.red(formatDate(new Date()) + '> ' + (error ? error : 'Bugger! You got me!')));
  }

  /**
   * global warning handler
   *
   */
  const handleWarning = warning => {
    console.log(chalk.yellow(formatDate(new Date()) + '> ' + warning));
  }

  /**
   * global log handler
   *
   */
  const log = log => {
    console.log(chalk.blue(formatDate(new Date()) + '> ' + log));
  }

  /**
   * format Date object as HH:mm:ss.millisecond
   *
   */
  const formatDate = date => {
    return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2) + '.' + ('00' + date.getMilliseconds()).slice(-3);
  }

  /**
   * asynchronously get contents of both user and tweet files
   *
   */
  const getFileContents = (userFilePath, tweetFilePath) => {
    return Promise.all([
        new FileToString(userFilePath).getContents().then(log('read in user file.')), 
        new FileToString(tweetFilePath).getContents().then(log('read in tweet file.'))
    ]);
  }

  /**
   * initial point of execution
   *
   */
  try {
    const {user, tweet} = validate(args);
    getFileContents(user, tweet)
      .then(responses => {
        log('raw data for both users and tweets have been retrieved'); 
        return responses;
      })
      .then(responses => {
        // TODO: amalgamate strings
      })
      .then(() => {
        const end = new Date().getTime();
        const duration = end - start;
        log('done in ' + duration + ' milliseconds!');
      })
      .catch(error => handleError(error));
  }
  catch(error) {
    handleError(error);
  }
  finally {
    const end = new Date().getTime();
    const duration = end - start;
    log('done in ' + duration + ' milliseconds');
  }
}
