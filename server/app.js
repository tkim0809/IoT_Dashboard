const express = require("express");
// const mysql = require("mysql");
const app = express();

const cors = require("cors");
const { default: mongoose } = require("mongoose");

// var db = mysql.createConnection({
//     host: "localhost",
//     user: "node"
// });

function start() {

    // app.use(cor({origin : true}));
    app.get("/", (req, res) => {
        return res.json("Hello..")
    });

    // app.get("/logs.json", (req, res) => {
    //     return res.json("Foo");
    // });

    mongoose.connect(process.envDB_STRING, { useNewUrlParser: true })
    mongoose.connection
        .once("open", () => console.log("Connected"))
        .on("error", (err) => console.log(err))

    app.listen(4000, () => console.log("Listening to port 4000"));
}

// db.connect(err => {
//     if (err) throw err;
//     start();
// })
