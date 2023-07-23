var express = require('express');
var router = express.Router();
var db = require('../database')
var bcrypt = require('bcrypt')

router.post('/register', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  if (!(email && password)) {
    res.status(400).json({ message: "email e password obrigatorios" });
    return;
  }

  var sql = 'select * from users where email = ?';
  var params = [email];

  db.get(sql, params, async (err, row) => {
    if (err) {
      console.error(err);
      return;
    }
    if(row) {
      res.status(409).json({message: "Usuario ja existe"});
      return;
    }

    var encryptedPassword = await bcrypt.hash(password, 10);

    sql = 'insert into users (email, password) values (?, ?)';
    params = [email, encryptedPassword];

    db.run(sql, params, (err, result) => {
      if(err) {
        console.error(err);
        return;
      }
      res.json({ message: "sucesso" });
    });
  });
});

router.post('/login', async function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  var sql = 'select * from users where email = ?';
  var params = [email];

  db.get(sql, params, async (err, row) => {
    if (err) {
      console.error(err);
      return;
    }

    if(row) {
      bcrypt.compare(password, row.password, (err, matched) => {
        if(matched) {
          res.status(200).json(row);
        } else {
          res.status(403).json({message: "usuario ou senha invalido"})
        }
      })
    } else {
      res.status(403).json({message: "usuario ou senha invalido"})
    }
  });
});

module.exports = router;
