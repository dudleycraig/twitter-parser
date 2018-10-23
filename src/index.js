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
   * parse user data, within user file, into structure 
   *
   */
  const parseUsers = users => {
    return users.split(/\r?\n/).reduce((users, line, index) => { // iterate text file lines 
      if(line && line.length > 0 && /^\s*([a-zA-Z]+\s+(?=follows))/.test(line)) {
        const words = line.split(/,?\s/g);
        const user = words[0];

        // get unique list of followers
        const followers = users[user] ? [...(new Set([...users[user], ...words.slice(2).map(name => name)]))] : words.slice(2).map(name => name); 

        // append follower to users array if they're not already there
        for(const followerIndex in followers) { 
          const follower = followers[followerIndex];
          if(!users[follower]) { 
            users[follower] = [];
          };
        }

        // append user to followers array
        users[user] = [...followers, user]; 
      }
      else if(line && line.length > 0) {
        handleWarning('Invalid format within users file for line ' + (index + 1));
      }
      return users;
    }, {});
  }

  /**
   * parse tweet data, within tweet file, into structure 
   *
   */
  const parseTweets = tweets => {
    return tweets.split(/\r?\n/).reduce((tweets, line, index) => {
      if(line && line.length > 0 && /^\s*([a-zA-Z]+(?=>))/.test(line)) {

        // extract both user and tweet
        const matches = line.match(/^\s*([a-zA-Z]+(?=>))\s*>\s*((?<=).*)$/); 
        const user = matches[1], tweet = matches[2];
        tweets.push({[user]:tweet});
      }
      else if(line && line.length > 0) {
        handleWarning('Invalid format within tweets file for line ' + (index + 1));
      }
      return tweets;
    }, []);
  }

  /**
   * parse both user and tweet data into a single structure 
   *
   */
  const parseAll = (users, tweets) => {

    // sort users by key. iterate users
    return Object.keys(users).sort().reduce((output, user) => { 

      // iterate tweets
      output[user] = tweets.reduce((tweetsFollowed, tweetObject, tweetIndex) => { 

        // get followed tweets for each user
        return tweetObject && users[user].includes(Object.keys(tweetObject)[0]) ? [...tweetsFollowed, tweetObject] : tweetsFollowed;
      }, []);
      return output;
    }, {});
  }

  /**
   * format single structure for stdout
   *
   */
  const formatAll = data => {
    for(const user in data) {
      try {
        console.log(user);
        data[user].forEach(twitter => { 
          console.log('\t@' + Object.keys(twitter)[0] + ': ' + twitter[Object.keys(twitter)[0]]);
        });
      }
      catch(error) {
        console.log(chalk.yellow('warning: ' + error));
      }
    }
  }

  /**
   * initial point of execution
   *
   */
  try {
    const {user, tweet} = validate(args);
    getFileContents(user, tweet)
      .then(responses => {
        log('raw data for both users and tweets have been retrieved.'); 
        return responses;
      })
      .then(responses => {
        const users = parseUsers(responses[0]);
        const tweets = parseTweets(responses[1]);
        const data = parseAll(users, tweets);
        log('raw data successfully parsed');
        log('formatting parsed data.');
        formatAll(data);
      })
      .then(() => {
        const end = new Date().getTime();
        const duration = end - start;
        log('done in ' + duration + ' milliseconds!');
      })
      .catch(error => handleError(error))
  }
  catch(error) {
    handleError(error);
  }
}
