var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());
var buf = new Buffer(256);

app.get('/', function(request, response) {
  buf.write(fs.readFile('index.html', function (err, data) {
    if (err) throw err;
    console.log(data);
  });
  response.send(res);

}););

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
