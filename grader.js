#!/usr/bin/env node
/*
Thanh
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2

 + restler
   -https://github.com/danwrong/restler

*/
var util = require('util');
var fs = require('fs');
var rest = require('restler');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URLLOCATION_DEFAULT = "http://polar-hollows-9719.herokuapp.com";

var callThis = function(result) {
if (data instanceof Error) {
    util.puts('Error: ' + result.message);
    this.retry(5000); // try again after 5 sec
  } else {
    util.puts(result);
  }
};

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertURLExists = function (url) {
    var inURL = url.toString().trim();
    rest.get(inURL).on('complete', function (result) {
        if (result instanceof Error) {
          util.puts('Error: ' + result.message);
          this.retry(5000); // try again after 5 sec
        } else {
            return inURL;
          }
  });
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

//var URLdata = rest.get(inURL).on('complete');
//console.log('URLdata = ' + URLdata);

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkURLlink = function(url, checksfile) {
    var inURL = url.toString().trim();
    var checks = loadChecks(checksfile).sort();
    var URLout = {};
/*
    for(var i in checks) {
        var URLpresent = $(checks[i]).length > 0;
        URLout[checks[i]] = URLpresent;
    }
    return URLout;
*/

    //rest.get(url);
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};


var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-c, --checks <checks_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-u, --url [value]', 'Path to the URL', clone(assertURLExists), URLLOCATION_DEFAULT)
        .parse(process.argv);

console.log('program.file= ' + program.file);
console.log('program.url = ' + program.url);
console.log('program.checks= ' + program.checks);

    if(program.url){
        rest.get(program.url).on('complete', function () {
                checkURLlink(program.url, program.checks); 
        });
console.log('program.url passed');
    }
    else {
    var checkJson = checkHtmlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log('outJson = ' + outJson);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
