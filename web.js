var express = require('express');

var app = express.createServer(express.logger());
var fs = require('fs');
var buf = new Buffer(256);

app.get('/', function(request, response) {
  var res = buf.write(fs.readFile('./index.html', function (err, data) {
    if (err) throw err;
    console.log(data);
  });
  response.send(res);

}););

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
