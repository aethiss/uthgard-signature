var express = require('express')
var app = express()
var request = require('request')

// set render Engine
app.set('view engine', 'ejs');
app.use('/static', express.static('src'))

app.get('/', function (req, res) {
  res.send('Please use UthgardSignature/player/YOURNICK')
})

app.get('/player/:nick', function (req, res) {
  request('https://uthgard.org/herald/api/player/' + req.params.nick, function (error, response, body) {
    if (response.statusCode === 404) {
      res.send('Nick Name NOT FOUND')
    }
    if (!error && response.statusCode == 200) {
      // res.send(body)
      console.log(body)
      res.render('signatures/standard', JSON.parse(body));
    }
  })
})

app.listen(3000, function () {
  console.log('Uthgard Signature Server running on port 8080')
})
