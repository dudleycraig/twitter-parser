/**
 * 
 *
 */
const minimist = require('minimist');
const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');

module.exports = () => {
  const args = minimist(process.argv.slice(2));
  const start = new Date().getTime();

  /**
   * initial point of execution
   *
   */
  try {
    console.log('initial output');
  }
  catch (error) {
    const end = new Date().getTime();
    const duration = end - start;
    log('done in ' + duration);
  }
}
