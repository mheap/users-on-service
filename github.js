var http = require("http");
var async = require('async');
var request = require("request");
var _ = require("underscore");


http.createServer(function (req, res) {
  if (req.method !== 'GET' || req.url === '/favicon.ico') { return res.end(''); }

  // Fetch usernames from other service
  request("http://localhost:3000?id=7972472", function(err, resp, body){

    var data = JSON.parse(body);

    var usernames = [];
    for (var i in data){
      usernames.push(data[i]);
    }

    // Grab the URL for each user
    async.map(usernames, function(item, callback){
      request.head("https://github.com/" + item + "/dotfiles", function(error, response, body){
        if (!error && response.statusCode == 200) {
          return callback(null, item);
        }

        return callback(null, null);
      });

    }, function (err, items){
      res.setHeader("Content-Type", "text/html");
      var items = _.compact(items);
      res.write("<ul>");
      _.each(items, function(item){
        res.write("<li><a href='https://github.com/" + item + "/dotfiles'>"+item+"</a></li>")
      });
      res.end('');
    });



  });

  // Make a list

}).listen(4000);
