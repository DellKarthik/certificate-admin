const User = require("../models/UserModel");
const FormData = require("form-data");
const axios = require("axios");
require("dotenv").config();

const CLOUD_FLARE_URL = process.env.CLOUD_FLARE_URL;
const AUTHKEY = process.env["X-Custom-Auth-Key"];
const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

// Controller to generate and upload certificate
// const generateAndUploadCertificate = async (req, res) => {
//   try {
//     const { userID, name, course, date, courseID } = req.body;

//     if (!userID || !name || !course || !date) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Step 1: Request the certificate image from Google Apps Script
//     const { data: imageUrl } = await axios.post(GOOGLE_SCRIPT_URL, {
//       name,
//       course,
//       date,
//     });

//     // Step 2: Download the image as a buffer
//     const imageResponse = await axios.get(imageUrl, {
//       responseType: "arraybuffer",
//     });
//     const imageBuffer = Buffer.from(imageResponse.data);

//     // Step 3: Prepare FormData for Cloudflare upload
//     const formData = new FormData();
//     formData.append("Filename", `${userID}Certificate`);
//     formData.append("type", "image/png"); // or dynamic based on image format
//     formData.append("image", imageBuffer, {
//       filename: `${userID}_Certificate.png`,
//     });

//     // Set headers for Cloudflare request
//     const headers = {
//       ...formData.getHeaders(),
//       "X-Custom-Auth-Key": AUTHKEY,
//     };

//     // Step 4: Upload image to Cloudflare
//     const response = await axios.put(CLOUD_FLARE_URL, formData, { headers });

//     if (response.status !== 200) {
//       throw new Error("Failed to upload image to Cloudflare");
//     }

//     const imageUrl2 = `${CLOUD_FLARE_URL}${userID}Certificate`;

//     // // Step 5: Update user's profile image URL in the database
//     // await User.findByIdAndUpdate(userID, { profileImageUrl: imageUrl2 });

//     // Find the user by userId
//     const user = await User.findById(userID);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const newCertificate = {
//       courseID,
//       name,
//       imageUrl2,
//     };

//     // Add the new certificate to the user's certificates array
//     user.certificates.push(newCertificate);

//     // Save the updated user document
//     await user.save();

//     return res.status(200).json({
//       message: "Certificate generated and uploaded successfully",
//       imageUrl2,
//       newCertificate,
//     });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "Server error during certificate generation and upload" });
//   }
// };

const generateAndUploadCertificate = async (req, res) => {
  try {
    const { userID, name, course, date, courseID } = req.body;

    // Validate required fields
    if (!userID || !name || !course || !date || !courseID) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Step 1: Request the certificate image from Google Apps Script
    const { data: imageUrl } = await axios.post(GOOGLE_SCRIPT_URL, {
      name,
      course,
      date,
    });

    // Step 2: Download the image as a buffer
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(imageResponse.data);

    // Step 3: Prepare FormData for Cloudflare upload
    const formData = new FormData();
    formData.append("Filename", `${userID}Certificate`);
    formData.append("type", "image/png"); // or dynamic based on image format
    formData.append("image", imageBuffer, {
      filename: `${userID}_Certificate.png`,
    });

    // Set headers for Cloudflare request
    const headers = {
      ...formData.getHeaders(),
      "X-Custom-Auth-Key": AUTHKEY,
    };

    // Step 4: Upload image to Cloudflare
    const response = await axios.put(CLOUD_FLARE_URL, formData, { headers });

    if (response.status !== 200) {
      throw new Error("Failed to upload image to Cloudflare");
    }

    // Construct the correct URL for the uploaded certificate
    const imageUrl2 = `${CLOUD_FLARE_URL}${userID}Certificate`;

    // Step 5: Find the user by userId
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare the new certificate object to match your model
    const newCertificate = {
      courseID, // ID of the course
      courseName: course, // Course name (assuming this is the intended value)
      certificateURL: imageUrl2, // The URL of the uploaded certificate
    };

    // Add the new certificate to the user's certificates array
    user.certificates.push(newCertificate);

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      message: "Certificate generated and uploaded successfully",
      imageUrl2,
      newCertificate,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Server error during certificate generation and upload" });
  }
};

module.exports = { generateAndUploadCertificate };
