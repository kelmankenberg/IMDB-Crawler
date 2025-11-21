const fs = require('fs');
const path = require('path');
let duckdb;
try {
  duckdb = require('duckdb');
} catch (e) {
  console.error('duckdb module not installed. Skipping import-sample smoke test.');
  process.exit(0);
}

async function run() {
  const db = new duckdb.Database(':memory:');
  const conn = db.connect();
  const samplePath = path.join(__dirname, '../tests/sample-data/title.basics.sample.tsv');

  const create = `CREATE TABLE title_basics (tconst VARCHAR, titleType VARCHAR, primaryTitle VARCHAR, originalTitle VARCHAR, isAdult INT, startYear VARCHAR, endYear VARCHAR, runtimeMinutes VARCHAR, genres VARCHAR);`;
  await new Promise((res, rej) => conn.run(create, (err) => (err ? rej(err) : res())));

  const copySQL = `COPY title_basics FROM '${samplePath.replace(/\\/g, '\\\\')}' (DELIMITER '\t', HEADER true);`;
  await new Promise((res, rej) => conn.run(copySQL, (err) => (err ? rej(err) : res())));

  await new Promise((res, rej) => conn.all("SELECT tconst, primaryTitle FROM title_basics LIMIT 10", (err, rows) => {
    if (err) return rej(err);
    console.log('Imported rows:', rows);
    res(rows);
  }));

  conn.close();
}

run().catch((err) => { console.error(err); process.exit(1); });
