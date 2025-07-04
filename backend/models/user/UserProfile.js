const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please add a first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please add a last name"],
    },
    bio: {
      type: String,
      maxLength: 120,
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /\+?[1-9]\d{1,14}/.test(v); // E.164 format
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    avatar: {
      type: String,
      default: process.env.DEFAULT_AVATAR,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
    },
    language: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Language",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("UserProfile", UserProfileSchema);
