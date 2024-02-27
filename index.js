let express = require('express');
let app = express();
let ejs = require('ejs');
const haikus = require('./haikus.json');
const port = process.env.PORT || 3000;
const fs = require("fs");
var bmp = require("bmp-js");

app.use(express.static('public'))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { haikus: haikus });
});

app.get('/picture/', (req, res) => {
  var bmpBuffer = fs.readFileSync('./public/images/lt50km_20_20.bmp');
  var bmpData = bmp.decode(bmpBuffer);
  res.send(bmpData);
  //var stream = new Buffer.from(fs.readFileSync('./public/images/lt50km_20_20.bmp', 'utf-8'))
  //res.send(stream.toJSON());
  //res.send(generateByteArray());
});


app.listen(port);

function generateByteArray() {
  var width = 64;
  var height = 32;
  var buffer = new Array(width * height);
  var bytes = new Array((width * height) / 8);

  // Column Major
  var temp;
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      temp = 1;//matrix[y][x];
      if (!temp) temp = 0;
      // Row Major or Column Major?
      //buffer[x * height + y] = temp;
      buffer[y * width + x] = temp;
    }
  }

  // Read buffer 8-bits at a time
  // and turn it into bytes
  for (var i = 0; i < buffer.length; i += 8) {
    var newByte = 0;
    for (var j = 0; j < 8; j++) {
      if (buffer[i + j]) {
        //newByte |= 1 << j;
        newByte |= 1 << (7 - j);
      }
    }
    bytes[i / 8] = newByte;
  }

  var formatted = bytes.map(function (x) {
    x = x + 0xFFFFFFFF + 1;  // twos complement
    x = x.toString(16); // to hex
    x = ("0" + x).substr(-2); // zero-pad to 8-digits
    x = "0x" + x;
    return x;
  }).join(', ');

  return formatted;
}
