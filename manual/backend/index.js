import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import crypto from 'crypto';

//import {decodeJWT, encodeJWT} from './token.js'


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
    const result = { ok: true, token: token };
    resp.send(JSON.stringify(result));

    });
});


app.listen(3002)