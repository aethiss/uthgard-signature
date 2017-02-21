var express = require('express')
var app = express()
var request = require('request')
var Jimp = require("jimp");
var streamifier = require('streamifier')


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

      // console.log('PLAYER : ', body)

      var player = JSON.parse(body)
      var realm = player['Realm'].toLowerCase()
      var nick = player['Name']
      var playerClass = player['Class']
      var realmPath = "src/images/"+ realm +"/"+ realm +".png"
      var classPath = "src/images/"+ realm +"/"+ player['Class'].toLowerCase() +".png"
      var realmRank = player['RealmRank'].toString().split('')
      var fullnick = nick + ' ' + realmRank[0] + 'L' + realmRank[1]
      var guild = player['Guild']

      Jimp.read(realmPath).then(function (image) {

        Jimp.read(classPath).then(function (classImage) {

          Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(function (fontNick) {

            Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then(function (font) {
              image.composite(classImage, 20, 2 )
                .print(font, 110, 30, playerClass)
                .print(fontNick, 250, 20, fullnick)
                .print(font, 280, 50, guild)
                .getBuffer(Jimp.MIME_JPEG, function (err, buffer) {
                  if (err) throw err;
                  var stream = streamifier.createReadStream(buffer, 'base64');
                  res.writeHead(200, {
                    'Content-Type': 'image/png'
                  });
                  stream.pipe(res)
                });
            })

          })

        })

      }).catch(function (err) {
        console.error('error : ', err);
      });

    }
  })
})

app.get('/test', function (req, res) {

  Jimp.read("src/images/albion/albion.png").then(function (image) {

    Jimp.read("src/images/albion/cleric.png").then(function (classImage) {

      Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then(function (font) {
        image.composite(classImage, 20, 2 )
          .print(font, 300, 10, "Hello world!")
          .getBuffer(Jimp.MIME_JPEG, function (err, buffer) {
            if (err) throw err;
            var stream = streamifier.createReadStream(buffer, 'base64');
            res.writeHead(200, {
              'Content-Type': 'image/png'
            });
            stream.pipe(res)
          });
      })

    })

  }).catch(function (err) {
    console.error('error : ', err);
  });
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Uthgard Signature Server running on port 3000')
})
