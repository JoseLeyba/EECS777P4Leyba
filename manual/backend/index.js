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
app.post("/login", function(req, res){
    //const {username, password} = req.body;
    //if (username === "alice" && password === "pass123") {
    //    const accessToken = createToken(
    //        {username, exp: Date.now() + 1000 * 60 * 15},
    //        "your-access-secret"
    //    );
    //    res.cookie("accessToken", accessToken, {httpOnly: true, secure: true});
    //    res.json({success: true});

    //} else {
    //    res.status(401).json({error: "Invalid Credentials"});
    //}
    console.log(req.body)

});

app.listen(3002)