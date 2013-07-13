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
    sys.puts('Error: ' + result.message);
    this.retry(5000); // try again after 5 sec
  } else {
    sys.puts(result);
  }
};

var assertFileExists = function(infile) {
console.log('assertFileExists is being called');
    var instr = infile.toString();
console.log('instr =' + instr);
console.log('!fs.existsSync(instr) =' + !fs.existsSync(instr));
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertURLExists = function(url) {
console.log('assertURLExists is being called');
    var inURL = url.toString();
        rest.get(url).on('complete', function(result) {
          if(result instanceof Error) {
              util.puts('Error: ' + result.message);
              process.exit(2); // http://nodejs.org/api/process.html#process_process_exit_code
          } else {
            return(inURL);
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

var checkURLlink = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {}; 
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }   
    return out;
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
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-u, --url <url_location>', 'Path to the URL', clone(assertURLExists), URLLOCATION_DEFAULT)
        .parse(process.argv);

if(program.url){
    rest.get(program.url).on('complete', checkURLLink(program.url, program.checks)); 
console.log('program.url');
}
else {
console.log('program.file=' + program.file);
console.log('else url=' + program.url);
    exports.checkHtmlFile = checkHtmlFile;
}
/*
    if(program.file) {
console.log('if');
    var checkJson = checkHtmlFile(program.file, program.checks);
console.log('co');
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
    }
    else {
console.log('else');
console.log('program.file=' + program.file);
console.log('program.checks=' + program.checks);
    var checkJson = checkHtmlFile(program.file, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
    }
*/
} else {
console.log('exporting');
    exports.checkHtmlFile = checkHtmlFile;
}
