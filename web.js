var express = require('express');
var fs = require('fs');
var buf = new Buffer(fs.readFileSync('index.html'););

var app = express.createServer(express.logger());
var buffed_str = "";

app.get('/', function(request, response) {
    response.send(buf.toString('utf8'));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
