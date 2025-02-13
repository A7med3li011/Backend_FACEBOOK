import storyModel from "../../db/models/storyModel.js";
import userModel from "../../db/models/userModel.js";
import cloudinary from "../../services/cloudinary.js";
import { handleAsync } from "../../utilities/handleAsync.js";
import { handleError } from "../../utilities/handleError.js";

export const handleAddStroy = handleAsync(async (req, res, next) => {
  const userExist = await userModel.findById(req.user._id);
  const story = req.file;

  const { title } = req.body;
  if (!userExist) return next(new handleError("user not found", 404));
  if (!story) {
    if (!title)
      return next(new handleError("there is no content to make story", 400));

    const contentType = "text";

    await storyModel.create({
      userId: req.user._id,
      contentType,
      title,
    });

    return res.status(201).json({ message: "story created succssfully" });
  }

  if (story) {
    const contentType = "media";

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      story.path,
      {
        folder: `FaceBook/User/story/${Math.random()}`,
      }
    );
    await storyModel.create({
      userId: req.user._id,
      contentType,
      title: title ? title : "",
      content: { secure_url, public_id },
    });
    return res.status(201).json({ message: "story created succssfully" });
  }
});
export const handlegetStroy = handleAsync(async (req, res, next) => {
  const userExist = await userModel
    .findById(req.user._id)
    .select("friends -_id");
  if (!userExist) return next(new handleError("user not found", 404));
  let ids = [...JSON.parse(JSON.stringify(userExist.friends)), req.user._id];
 

  const story = await storyModel.find({ userId: { $in: ids } }).populate({
    path: "userId",
    select: "name profilePic",
  });
  res.json({ message: "done", story });
});
