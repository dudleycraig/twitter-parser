# twitter-parser

![dynamic screenshot](https://raw.githubusercontent.com/dudleycraig/twitter-parser/master/twitter-parser.gif)

developed in node (v8.10.0), using npm (3.5.2) on vbox running ubuntu


## installation
1. git clone https://github.com/dudleycraig/twitter-parser.git

2. cd twitter-parser

3. npm install (note you may need sudo privileges, depending on your setup)

4. chmod -Rvf 755 bin/twitter-parser

5. bin/twitter-parser --user assets/user.txt --tweet assets/tweet.txt


## assumptions 
* 7-bit ascii/ISO 8859-1 encoding is assumed for user and tweet source files.

* file names are REQUIRED to have a ".txt" file extension.

* tweeters' names are ONLY alphabetical ([a-zA-Z]).

* if the formatting is incorrect, that line will be ignored and logged to console as a warning.

* tweets without a defined user will be ignored.

* logs are displayed in conjunction with stdout
