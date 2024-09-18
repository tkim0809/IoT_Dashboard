const express = require("express");
const mysql = require("mysql");
const app = express();

const cors = require("cors");

var db = mysql.createConnection({
    host: "localhost",
    user: "node"
});

function start() {
    app.get("/", (req, res) => {
        return res.json("Hello..")
    });

    app.get("/logs.json", (req, res) => {
        return res.json("Foo");
    });

    app.listen(4000, () => console.log("Listening to port 4000"));
}

db.connect(err => {
    if (err) throw err;
    start();
})