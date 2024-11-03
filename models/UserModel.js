const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    terms: {
      // New field for terms agreement
      type: Boolean,
      required: true,
    },
    profileImageUrl: {
      type: String, // New field to store profile image URL
    },
    purchasedCourses: [
      {
        courseID: {
          type: String, // Store as String for external course data
        },
        purchaseDate: {
          type: Date,
          default: Date.now,
        },
        TotalModules: {
          type: Number, // Stores the total number of modules in the course
          required: true,
        },
        progress: {
          modules: [
            {
              moduleID: { type: String }, // Unique identifier for each module
              completed: { type: Boolean, default: false },
              topics: [
                {
                  topicID: { type: String }, // Unique identifier for each topic
                  watched: { type: Boolean, default: false },
                  completionDate: { type: Date }, // Optional: date when completed
                },
              ],
            },
          ],
        },
      },
    ],
    certificates: [
      {
        courseID: {
          type: String,
        },
        courseName: {
          type: String,
        },
        certificateURL: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password before saving (optional)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  // Hash password logic (for example, using bcrypt)
  const bcrypt = require("bcrypt");
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
