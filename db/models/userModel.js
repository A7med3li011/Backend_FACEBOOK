import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  work: {
    type: String,
  },
  live: {
    type: String,
  },
  Studied: {
    type: String,
  },
  from: {
    type: String,
  },

  birthOfDate: {
    type: Date,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  profilePic: {
    secure_url: String,
    public_id: String,
  },
  coverPic: {
    secure_url: String,
    public_id: String,
  },
  friends: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  recieveRequests: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  sendRequests: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],

  posts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  ],
  verified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
  allImages: [{ secure_url: String, public_id: String }],
});

const userModel = model("User", userSchema);

export default userModel;
