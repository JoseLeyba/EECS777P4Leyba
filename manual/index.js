import express from 'express'

const app = express()

app.get("/", function(req, res){
    res.send("Today is " + new Date());
});

app.listen(6789);