var express = require('express')
var app = express()

app.get('/', function (req, res) {

  var request = require('request');
  request('https://uthgard.org/herald/api/player/Alita', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // Show the HTML for the Google homepage.
    }
  })

  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Uthgard Signature Server running on port 3000')
})