/**
 * takes file input and spits out a string representation
 *
 */
const fs = require('fs');

module.exports = class FileToString {
  constructor(path) {
    this.path = path;
    this.stats = null;
    this.buffer = null;
    return this;
  }

  getContents() {
    if(!fs.existsSync(this.path)) {
      throw 'Unable to read file "' + this.path + '".';
    }
    return this.pathToBuffer()
      .then(() => this.statsFromBuffer())
      .then(() => this.validateBuffer()) 
      .then(() => this.buffer.toString('ascii'));
  }

  pathToBuffer() {
    return new Promise((resolve, reject) => fs.readFile(this.path, (error, buffer) => {
      this.buffer = buffer;
      return error ? reject(error) : resolve(buffer);
    }));
  }

  statsFromBuffer(buffer) {
    return new Promise((resolve, reject) => fs.stat(this.path, (error, stats) => {
      this.stats = stats;
      return error ? reject(error) : resolve(stats);
    }));
  }

  validateBuffer(buffer = this.buffer) {
    if(this.stats && this.stats.isFile() && this.stats.size && this.stats.size > 0) { 
      for (let i = 0; i < this.buffer.length; i++) {
        if(this.buffer[i] > 127) {
          throw 'Bad 7-bit ascii file, first instance of invalid character being "' + String.fromCharCode(this.buffer[i]) + '" (' + this.buffer[i] + ')' + '.'; 
        }
      }
    }
    else { 
      throw 'Bad 7-bit ascii file, unable to determine file characteristics.';
    }
    return buffer;
  }
};
