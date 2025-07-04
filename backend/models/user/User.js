const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    role: {
      type: String,
      enum: ["admin", "student", "teacher"],
      default: "student",
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minLength: 6,
      select: false, // when we get a user through API, it is not going to actually show the password, it is not going to return the password or setting select to false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isVerified: {
      type: Boolean,
      default: false,
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

UserSchema.virtual("userProfile", {
  ref: "UserProfile",
  localField: "_id",
  foreignField: "user",
  justOne: true,
});

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign jwt and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

  return resetToken; // original token(not hashed)
};

// Cascade delete UserProfile when a user is deleted
UserSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`User Profile being removed from user ${this._id}`);
    await this.model("UserProfile").deleteOne({ user: this._id });

    console.log(`Conversations being removed from user ${this._id}`);
    await this.model("Conversation").deleteMany({ user: this._id });

    console.log(`User Feed being removed from user ${this._id}`);
    await this.model("UserFeed").deleteOne({ user: this._id });

    next();
  }
);

UserSchema.statics.getFiltered = async function (userId, projection) {
  const obj = await this.aggregate([
    { $match: { _id: userId } },
    { $project: projection },
  ]);
  return obj;
};

module.exports = mongoose.model("User", UserSchema);
