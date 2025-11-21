import fs from 'fs';
import path from 'path';
import { Database } from 'duckdb';

async function run() {
  const db = new Database(':memory:');
  const conn = db.connect();
  const samplePath = path.join(__dirname, '../tests/sample-data/title.basics.sample.tsv');

  const create = `CREATE TABLE title_basics (tconst VARCHAR, titleType VARCHAR, primaryTitle VARCHAR, originalTitle VARCHAR, isAdult INT, startYear VARCHAR, endYear VARCHAR, runtimeMinutes VARCHAR, genres VARCHAR);`;
  await conn.run(create);

  const copySQL = `COPY title_basics FROM '${samplePath.replace(/\\/g, '\\\\')}' (DELIMITER '\t', HEADER true);`;
  await conn.run(copySQL);

  const rows = await conn.all("SELECT tconst, primaryTitle FROM title_basics LIMIT 10");
  console.log('Imported rows:', rows);
  conn.close();
}

run().catch((err) => { console.error(err); process.exit(1); });
