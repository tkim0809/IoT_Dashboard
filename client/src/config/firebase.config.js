import { getApp, getApps, initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"


const firebaseConfig = {
    apiKey: "AIzaSyBNeCUneDpzQSqe89xeixwzLt1Y6JEV7m8",
    authDomain: "iot-dashboard-5cbbe.firebaseapp.com",
    projectId: "iot-dashboard-5cbbe",
    storageBucket: "iot-dashboard-5cbbe.appspot.com",
    messagingSenderId: "127245578470",
    appId: "1:127245578470:web:d1b464b1266f48367c4b27"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const storage = getStorage(app);

export { app, storage };