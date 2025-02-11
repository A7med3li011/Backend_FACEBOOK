import postModel from "../../db/models/postModel.js";
import userModel from "../../db/models/userModel.js";
import { handleAsync } from "../../utilities/handleAsync.js";

export const handleGetTimeline = handleAsync(async (req, res, next) => {
  const userFriends = await userModel
    .findById(req.user._id)
    .select("friends -_id");

  let ids = [...JSON.parse(JSON.stringify(userFriends.friends)), req.user._id];

  const posts = await postModel.find({ userId: { $in: ids } }).populate({
    path:"userId",
    select:"name profilePic"
  }).populate({
    path: "comments.user",
    select: "profilePic name",
  });;
  res.json({ message: "lolo", posts });
});
