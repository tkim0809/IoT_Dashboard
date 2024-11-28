const admin = require("firebase-admin");

const serviceAccount = require("./iot-dashboard-5cbbe-firebase-adminsdk-37q8k-7e60b2b516.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


module.exports = admin