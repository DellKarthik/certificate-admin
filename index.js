const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const {
  generateAndUploadCertificate,
} = require("./controllers/certificateController");

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;
 
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Route for generating and uploading certificate
app.post("/generate-certificate", generateAndUploadCertificate);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, Certificate`);
});
// MongoDB connection setup
mongoose
  .connect(process.env.mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
