const express = require("express");
const { checkS3Connection, listAllAirlines, listAllFleets, listAllSubfleets, listAllTailIDs, listAllFilesInTailID, getProgressData } = require('./config/database/s3bucket');
const cors = require("cors");
const { default: mongoose } = require("mongoose");

const app = express();
require('dotenv/config');

app.use(cors({ origin: true }));

const userRoute = require("./routes/user");

app.get("/", (req, res) => {
    return res.json("Hello..");
});

checkS3Connection();

app.use(express.json());
app.get("/", (req, res) => {
    return res.json("Hello..")
});

//User authentication route
app.use("/api/users/", userRoute)

//list all airlines
app.get('/api/airlines', async (req, res) => {
    try {
        // Fetch all unique airlines
        const airlines = await listAllAirlines();
        res.json({ airlines });
    } catch (error) {
        console.error("Error fetching airlines:", error.message);
        res.status(500).json({ message: 'Failed to retrieve airlines' });
    }
});

// List all fleets
app.get('/api/fleets', async (req, res) => {
    try {
        const { airline } = req.query;

        // Validate the airline parameter
        if (!airline) {
            return res.status(400).json({
                message: "Missing required query parameter: airline"
            });
        }

        // Fetch fleets for the specified airline
        const fleets = await listAllFleets(airline);
        res.json({ fleets });
    } catch (error) {
        console.error("Error fetching fleets:", error.message);
        res.status(500).json({ message: 'Failed to retrieve fleets' });
    }
});

// List all subfleets
app.get('/api/subfleets', async (req, res) => {
    try {
        const { airline, fleet } = req.query;

        // Validate required query parameters
        if (!airline || !fleet) {
            return res.status(400).json({
                message: "Missing required query parameters: airline, fleet"
            });
        }

        // Call the modified listAllSubfleets function
        const subfleets = await listAllSubfleets(airline, fleet);

        res.json({ subfleets });
    } catch (error) {
        console.error("Error fetching subfleets:", error.message);
        res.status(500).json({ message: 'Failed to retrieve subfleets' });
    }
});


app.get('/api/tailids', async (req, res) => {
    try {
        const { airline, fleet, subfleet } = req.query;

        // Validate the required query parameters
        if (!airline || !fleet || !subfleet) {
            return res.status(400).json({
                message: "Missing required query parameters: airline, fleet, subfleet"
            });
        }

        // Fetch all unique tail IDs for the specified path
        const tailIDs = await listAllTailIDs(airline, fleet, subfleet);

        res.json({ tailIDs });
    } catch (error) {
        console.error("Error fetching tail IDs:", error.message);
        res.status(500).json({ message: 'Failed to retrieve tail IDs' });
    }
});

// List all files in a specific tail ID directory
app.get('/api/campaign', async (req, res) => {
    try {
        const { airline, fleet, subfleet, tailID } = req.query;

        // Validate the required query parameters
        if (!airline || !fleet || !subfleet || !tailID) {
            return res.status(400).json({
                message: "Missing required query parameters: airline, fleet, subfleet, tailID",
            });
        }

        console.log(`Received request for files: airline='${airline}', fleet='${fleet}', subfleet='${subfleet}', tailID='${tailID}'`);

        // Fetch all files for the specified tail ID
        const files = await listAllFilesInTailID(airline, fleet, subfleet, tailID);

        if (!files.length) {
            return res.status(404).json({
                message: "No files found for the specified parameters.",
            });
        }

        res.json({ files });
    } catch (error) {
        console.error("Error fetching files:", error.message);
        res.status(500).json({ message: "Failed to retrieve files" });
    }
});

app.get('/api/progress', async (req, res) => {
    try {
        const { airline, fleet, subfleet, tailID } = req.query;

        if (!airline || !fleet || !subfleet || !tailID) {
            return res.status(400).json({
                message: "Missing required query parameters: airline, fleet, subfleet, tailID",
            });
        }

        console.log(`Received request for progress data: airline='${airline}', fleet='${fleet}', subfleet='${subfleet}', tailID='${tailID}'`);

        const progressData = await getProgressData(airline, fleet, subfleet, tailID);

        if (!progressData.length) {
            return res.status(404).json({
                message: "No progress data found for the specified parameters.",
            });
        }

        res.json({ progressData });
    } catch (error) {
        console.error("Error fetching progress data:", error.message);
        res.status(500).json({ message: "Failed to retrieve progress data" });
    }
});


mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true })
mongoose.connection
    .once("open", () => console.log("Connected"))
    .on("error", (err) => console.log(err))

app.listen(4000, () => console.log("Listening to port 4000"));
