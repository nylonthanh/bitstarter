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

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertURLExists = function (inurl) {
    var inURLstr = inurl.toString();
    var existData = rest.get(inURLstr).on('complete', function (results) { return results });
    if (existData) {
        return inURLstr;
    }
    else { 
        util.puts('URL error');
    }
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkURLlink = function(urlData, checksfile) {
    var checksURL = loadChecks(checksfile).sort();
    var URLout = {};
    $ = cheerio.load(urlData); // load the URL content and process

        for(var i in checksURL) {
            var URLpresent = $(checksURL[i]).length > 0;
            URLout[checksURL[i]] = URLpresent;
        }
    return URLout;
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
        //.option('-u, --url [value]', 'Path to the URL', clone(assertURLExists), URLLOCATION_DEFAULT)

if(require.main == module) {
    program
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists) )
        .option('-c, --checks <checks_file>', 'Path to checks.json', clone(assertFileExists) )
        .option('-u, --url <value>', 'Path to the URL')
        .parse(process.argv);
    //processing
console.log('************************');
console.log('program.file = ' + program.file);
console.log('program.checks = ' + program.checks);
console.log('program.url = ' + program.url);
console.log('************************');
    if(program.url){
        rest.get(program.url).on('success', function (result) { 
            var checkJsonUrl = checkURLlink(result, program.checks);
            var outJsonUrl = JSON.stringify(checkJsonUrl, null, 4);
            console.log(outJsonUrl);
        });
    }
    else if (program.url !== 'export'){
        var checkJson = checkHtmlFile(program.file, program.checks);
        var outJson = JSON.stringify(checkJson, null, 4);
        console.log(outJson);
    }
    else {
      console.log('Exporting...');
      exports.checkURLlink= checkURLlink;
    }
} 
