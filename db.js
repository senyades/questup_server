const { Pool } = require('pg');
const pool = new Pool({
  connectionString: "postgres://default:4UEtZuMp3ilq@ep-blue-mud-a4u1zj3q.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require"
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log(result.rows, "Подключились");
  });
});

module.exports = pool;
