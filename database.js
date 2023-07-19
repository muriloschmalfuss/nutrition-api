var sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE products (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    total_fat INTEGER,
                    cholesterol INTEGER,
                    sodium INTEGER,
                    total_carbohydrate INTEGER,
                    protein INTEGER
                )`,
      (err) => {
        if (err) {
          console.error(err);
          throw err
        }
      }
    )
  }
});

module.exports = db;