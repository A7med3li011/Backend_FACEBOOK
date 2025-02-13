import mongoose, { Schema } from "mongoose";

const storySchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
  },
  contentType: {
    type: String,
  },
  content: {
    secure_url: String,
    public_id: String,
  },

  createdAt: { type: Date, default: Date.now(), expires: 86400 },
});

const storyModel = mongoose.model("Story", storySchema);

export default storyModel;
