// declare variables for genre, country, and avg_vote searches
// create if statments that utilize .includes to match the search with instances in the array of movies
// ****genre => specified string | case insensitive
// ****country => specified string | case insensitive
// ****avg_vote => arrayRating >= searchRating
// Set up Authorization Header with an API token value
// Set up general Security (headers, CORS)

/* Sample Movie Listing 
{
    filmtv_ID: 2,
    film_title: "Bugs Bunny's Third Movie: 1001 Rabbit Tales",
    year: 1982,
    genre: 'Animation',
    duration: 76,
    country: 'United States',
    director: 'David Detiege, Art Davis, Bill Perez',
    actors: 'N/A',
    avg_vote: 7.7,
    votes: 28,
  },
*/

// Imports
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const movies = require('./moviedex.js');

// Running imports on 'app'
const app = express();
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

// Validating token
app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});

// Getting movie JSON data and setting up conditionals to compare user queries to data
function handleGetMovieInfo(req, res) {
  let { genre, country, avg_vote } = req.query;
  if (genre) {
    if (!['genre', 'country', 'avg_vote'].includes(genre, country, avg_vote)) {
      return res
        .status(400)
        .send('Query needs to be a valid genre, country, or avg_vote');
    }
  }

  let results;

  if (genre) {
    results = movies.filter(movie =>
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    );
  } else if (country) {
    results = movies.filter(movie =>
      movie.country.toLowerCase().includes(country.toLowerCase())
    );
  } else if (avg_vote) {
    results = movies.filter(movie => movie.avg_vote >= avg_vote);
  } else {
    results = movies;
  }

  res.send(results);
}
// Setting up MOVIE route
app.get('/movie', handleGetMovieInfo);

// Hiding sensitive error messages

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

// Listening on the PORT
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
