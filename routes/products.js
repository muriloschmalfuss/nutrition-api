var express = require('express');
var router = express.Router();
var db = require('../database');

router.get('/', function(req, res, next) {
  var sql = "select * from products";

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  })
});

router.get('/:id', function(req, res, next) {
  var sql = "select * from products where id = ?";
  var params = [req.params.id];

  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(row);
  })
});

router.post('/', function(req, res, next) {
  var errors = [];

  if (!req.body.name) {
    errors.push('nome é obrigatório.')
  }

  if (errors.length) {
    res.status(400).json({ error: errors.join(',') });
    return;
  }

  var data = {
    name: req.body.name,
    calories: req.body.calories,
    total_fat: req.body.total_fat,
    cholesterol: req.body.cholesterol,
    sodium: req.body.sodium,
    total_carbohydrate: req.body.total_carbohydrate,
    protein: req.body.protein
  }

  var sql = "insert into products (name, calories, total_fat, cholesterol, sodium, total_carbohydrate, protein) values (?, ?, ?, ?, ?, ?, ?)"
  var params = [data.name, data.calories, data.total_fat, data.cholesterol, data.sodium, data.total_carbohydrate, data.protein];

  db.run(sql, params, function(err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: data,
      id: this.lastID
    })
  })
});

router.put('/:id', function(req, res, next) {
  var data = {
    name: req.body.name,
    calories: req.body.calories,
    total_fat: req.body.total_fat,
    cholesterol: req.body.cholesterol,
    sodium: req.body.sodium,
    total_carbohydrate: req.body.total_carbohydrate,
    protein: req.body.protein
  };

  db.run(`update products set
    name = COALESCE(?, name),
    calories = COALESCE(?, calories),
    total_fat = COALESCE(?, total_fat),
    cholesterol = COALESCE(?, cholesterol),
    sodium = COALESCE(?, sodium),
    total_carbohydrate = COALESCE(?, total_carbohydrate),
    protein = COALESCE(?, protein)
    where id = ?`,
    [data.name, data.calories, data.total_fat, data.cholesterol, data.sodium, data.total_carbohydrate, data.protein, req.params.id],
    function(err, result) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: data,
        changes: this.changes
      })
    }
  )
});

router.delete('/:id', function(req, res, next) {
  db.run(
    "delete from products where id = ?",
    req.params.id,
    function(err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.json({ message: "deleted", changes: this.changes });
    }
  );
});

module.exports = router;
