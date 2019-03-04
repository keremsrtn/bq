'use strict';

const express = require('express');

const app = express();

// Imports the Google Cloud client library
const {BigQuery} = require('@google-cloud/bigquery');

// Creates a client
const bigquery = new BigQuery();

// The SQL query to run
const sqlQuery = `SELECT
  CONCAT(
    'https://stackoverflow.com/questions/',
    CAST(id as STRING)) as url,
  view_count
  FROM \`bigquery-public-data.stackoverflow.posts_questions\`
  WHERE tags like '%google-bigquery%'
  ORDER BY view_count DESC
  LIMIT 10`;

const options = {
  query: sqlQuery,
  // Location must match that of the dataset(s) referenced in the query.
  location: 'US',
};

// Runs the query
const [rows] = await bigquery.query(options);

console.log('Query Results:');
rows.forEach(row => {
  const url = row['url'];
  const viewCount = row['view_count'];
  console.log(`url: ${url}, ${viewCount} views`);
});

app.get('/', (req, res) => {
  //res.status(200).send('Hello, world! ');
  res.send("works");
});

if (module === require.main) {
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;
