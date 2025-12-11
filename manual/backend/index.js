import express from 'express'
import crypto from 'crypto'
import {decodeJWT, encodeJWT} from './token.js'

const app = express()

app.post("/auth/login", (req, res) => {
    const {username, password} = req.body;
    if (username === "alice" && password === "pass123") {
        const accessToken = createToken(
            {username, exp: Date.now() + 1000 * 60 * 15},
            "your-access-secret"
        );
        res.cookie("accessToken", accessToken, {httpOnly: true, secure: true});
        res.json({success: true});

    } else {
        res.status(401).json({error: "Invalid Credentials"});
    }

});

