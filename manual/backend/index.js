import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import {decodeJWT, encodeJWT} from './token.js'
import dotenv from "dotenv";
dotenv.config();


const SECRET = process.env.SECRET;
if (!SECRET) {
    console.error("FATAL ERROR: SECRET not found in environment.");
    process.exit(1);
}
const app = express()
app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("tasks.db", sqlite3.OPEN_READWRITE);
//Modified minimally so we also get the account type


//CREATE TABLES (and admin acc) at start 
db.serialize(() => {
db.run(`
    CREATE TABLE IF NOT EXISTS accounts (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      name     TEXT NOT NULL UNIQUE,
      pw       TEXT NOT NULL,
      acc_type TEXT NOT NULL
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS urls (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      url     TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES accounts(id)
    )
  `);
  const hashedAdminPw = bcrypt.hashSync("admin", 10);
  db.get(
    "SELECT id, pw, acc_type FROM accounts WHERE name = ?",
    ["admin"],
    (err, row) => {
      if (!row) {
        db.run(
          "INSERT INTO accounts (name, pw, acc_type) VALUES (?, ?, 'admin')",
          ["admin", hashedAdminPw])
        }
    });
});


app.post("/login", function(req, resp){
    const name = req.body.name;
    const pw = req.body.pw;
    const Q =
    "SELECT name,id, pw, acc_type FROM accounts" +
    " WHERE name = ?";

    db.get(Q,[name] ,function(err, row) {
    if (!row) {
    return resp
      .status(401)
      .json({
        ok: false,
        error: "No users were found with these credentials, please try again.",
      });
    }

    const storedHash = row.pw;
    //Compare hashes
    const valid = bcrypt.compareSync(pw, storedHash);
    if (!valid) {
        return resp.status(401).json({
            ok: false,
            error:
            "No users were found with these credentials, please try again.",
        });
    }
    const creds = { name: row["name"], id: row["id"], acc_type: row["acc_type"] };
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

//Delete is just like add
app.post("/delete", function(req, resp){
    const authHeader = req.headers.authorization || "";
    const token = decodeJWT(authHeader.substring(7, authHeader.length), SECRET)
    const id = token.id;
    const accType = token.acc_type;
    const name = req.body.id;
    let Q;
    let params;
    if (accType === "admin"){
        const Q = "DELETE FROM urls WHERE id = ?";
        params = [name];
        db.run(Q, params, function(err) {
            if (err) {
                console.log("DB error:", err);
                return;
            }
            resp.json({ success: true });
        });
    }
    else{
        const Q = "DELETE FROM urls WHERE id = ? AND user_id = ?";
        params = [name, id];
        db.run(Q, params, function(err) {
            if (err) {
                console.log("DB error:", err);
                return;
            }
            if (this.changes === 0) {
                return resp.status(403).json({
                success: false,
                error: "You can only delete your own URLs.",
        });
        }

        resp.json({ success: true });

        });
    }

});


app.post("/register", function(req, resp){
    const name = req.body.name;
    const pw = req.body.pw;
    const hashedPw = bcrypt.hashSync(pw, 10);
    const QCHECK =
    "SELECT id FROM accounts WHERE name = ?";

    db.get(QCHECK, [name],  function(err, row) {
        if (row) {
        return resp.status(400).json({
                    ok: false,
                    error: "Username already exists."});
        }
        
        const Q =
        "INSERT INTO accounts (name, pw, acc_type) VALUES (?, ?, 'user')";

        db.run(Q, [name, hashedPw],  function(err2, row) {
        if (err2) {
        console.log("DB error:", err2);
        return;
        }

        const creds = { name: name, id: this.lastID, acc_type: "user" };
        const token = encodeJWT(creds, SECRET)
        const result = { ok: true, token: token };
        resp.send(JSON.stringify(result));

        });
    });
});


app.listen(3002)