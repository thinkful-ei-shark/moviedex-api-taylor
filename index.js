const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');


const app = express();

app.use(morgan('common'));
app.use(helmet());
app.use(cors());

const movies = require('./moviedex.js');


app.get('/movie', (req, res) => {
  res.send('Hello, Express');
});


app.listen(8000, () => {
  console.log('Server is listening on PORT 8000');
});