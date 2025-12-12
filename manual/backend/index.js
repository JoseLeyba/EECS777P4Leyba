import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import crypto from 'crypto';

import {decodeJWT, encodeJWT} from './token.js'


const SECRET = "MY_SUPER_SECRET";
const app = express()
app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("tasks.db", sqlite3.OPEN_READWRITE);
app.post("/login", function(req, resp){
    const name = req.body.name;
    const pw = req.body.pw;
    const Q =
    "SELECT name,id FROM accounts" +
    " WHERE pw = '" + pw +
    "' AND name = '" + name + "'";

    db.get(Q, function(err, row) {
    if (!row) {
      resp.send(JSON.stringify({ ok:false }));
      return;
    }
    const creds = { name: row["name"], id: row["id"] };
    const token = encodeJWT(creds, SECRET)
    const result = { ok: true, token: token };
    resp.send(JSON.stringify(result));

    });
});

app.post("/home", function(req, resp){
    //Without the || I crashed when undef :(
    const authHeader = req.headers.authorization || "";
    const token = decodeJWT(authHeader.substring(7, authHeader.length), SECRET)
    const Q =
    "SELECT id, url FROM urls";

    db.all(Q, function(err, rows) {
    if (err) {
      console.log("DB error:", err);
      //Still send an empty list of urls to not crash rlly badly
      resp.status(500).json({ urls: [] });
      return;
    }
    const urls = rows.map(r => ({
      id: r.id,
      name: r.url,
    }));
    resp.json({urls});
    });
});

app.post("/add", function(req, resp){
    const authHeader = req.headers.authorization || "";
    const token = decodeJWT(authHeader.substring(7, authHeader.length), SECRET)
    const id = token.id;
    const name = req.body.url;

    const Q = "INSERT INTO urls (user_id, url) VALUES (?, ?)";
    db.run(Q, [id, name], function(err) {
    if (err) {
      console.log("DB error:", err);
      return;
    }
    console.log("Inserted Successfully on Q: ",Q);
    resp.send(JSON.stringify({'success':true}));

    });
});


app.listen(3002)