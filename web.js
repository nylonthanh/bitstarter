var express = require('express');
var fs = require('fs');
var rest = require('restler');
var cheerio = require('cheerio');

var buf = new Buffer(fs.readFileSync('index.html'));
var app = express.createServer(express.logger());

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

app.get('/', function(request, response) {
    rest.get(apiurl).on('complete', response2console);
    response.send(buf.toString('utf8'));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

}

