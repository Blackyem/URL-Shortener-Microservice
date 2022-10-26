const express = require('express');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const urlparser = require("url")
const dns = require("dns");
const cors = require('cors')


const app = express();

dotenv.config();

app.use(cors());
app.use(express.json({
  extended: true
}));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.json());

app.get('/', function (_req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// mongoose.connect(process.env.DB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });
// // console.log(mongoose.connection.readyState)

// const Schema = new mongoose.Schema({
//   Url: String
// });

// const Url = mongoose.model("Url", Schema);



const originalUrls = []
const shortUrls = []

app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;
  const foundIndex = originalUrls.indexOf(url);

  if (!url.includes("https://") && !url.includes("http://")) {
    return res.json({
      error: "Invalid Url"
    });
  }

  if (foundIndex < 0) {
    originalUrls.push(url);
    shortUrls.push(shortUrls.length);

    return res.json({
      original_url: url,
      short_url: shortUrls.length - 1
    })
  }

  return res.json({
    original_url: url,
    short_url: shortUrls[foundIndex]
  })
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  const shorturl = parseInt(req.params.shorturl);
  const foundIndex = shortUrls.indexOf(shorturl);

  if (foundIndex < 0) {
    return res.json({
      error: "No short URL found for the give input"
    })
  }
  res.redirect(originalUrls[foundIndex]);
});


// Basic Configuration
const PORT = process.env.PORT || 5050;

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`)
});