require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const url = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(bodyParser.urlencoded({ extended: false }));

let urlDatabase = [];

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  const parsedUrl = url.parse(originalUrl);

  if (!parsedUrl.host || !parsedUrl.protocol) {
    res.json({ error: 'invalid url' });
    return;
  }

  dns.lookup(parsedUrl.host, (err) => {
    if (err) {
      res.json({ error: 'invalid url' });
      return;
    }

    const shortUrl = urlDatabase.length;
    urlDatabase.push(originalUrl);

    res.json({ original_url: originalUrl, short_url: shortUrl });
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);

  if (shortUrl >= 0 && shortUrl < urlDatabase.length) {
    res.redirect(urlDatabase[shortUrl]);
  } else {
    res.status(404).send('Not found');
  }
});

//#region
/* / * Энэ төсөл нь хэрэглэгчдийг URL-ийг богиносгох боломжийг олгодог энгийн API үүсгэхэд хүргэдэг.API нь хүсэлтийн биед URL-тэй хамт Post Post хүсэлтийг хүлээн аваад анхны URL, богино URL-ийг агуулсан JSON объектыг буцаана.Хэрэглэгчийн айлчлал / API / POTELTURL / <BOTELLETLE / <BOTELLING> Эдгээр URL руу дахин чиглүүлж байна.

Та энэ кодыг (E.G., Server.JS) ашиглан файлыг (E.G., Server.Js) -ийг ажиллуулж, NPM Sploper-ийг url url-ийг суулгаж, зангилааны сервер ашиглан файлыг ажиллуулж болно.Сервер нь http: // lockhost: // lockhost: 3000: 3000 / API / POLLURL-ийг авах замаар API-г шалгаж болно.
</ Богино_ур> */

//#endregion
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
