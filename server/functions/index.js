const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");  // Optional logger

const admin = require("firebase-admin");
require('dotenv').config();

const serviceAccountKey = require('./serviceAccountKey.json');

const express = require('express');
const app = express();

// Body parser for our JSON data
app.use(express.json());

// Cross-origin setup
const cors = require("cors");
app.use(cors({ origin: true }));

app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    next();
});

// Firebase credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});

// API endpoints
app.get("/", (req, res) => {
    return res.send("Hello world");
});

// Export using v2 trigger
exports.app = onRequest(app);
