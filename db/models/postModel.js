import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
  },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  content: {
    secure_url: String,
    public_id: String,
  },
  contentType: {
    type: String,
  },

  createdAte: { type: Date, default: Date.now() },
});

const postModel = mongoose.model("Post", postSchema);

export default postModel;
