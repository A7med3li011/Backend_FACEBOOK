import postModel from "../../db/models/postModel.js";
import userModel from "../../db/models/userModel.js";
import cloudinary from "../../services/cloudinary.js";
import { handleAsync } from "../../utilities/handleAsync.js";
import { handleError } from "../../utilities/handleError.js";

export const handleAddPost = handleAsync(async (req, res, next) => {
  const { title } = req.body;
  const media = req.file;

  const userExist = await userModel.findById(req.user._id);

  if (!userExist) return next(new handleError("user not found", 404));

  if (!media) {
    if (!title)
      return next(new handleError("there is no content to create post", 400));

    const post = await postModel.create({
      userId: req.user._id,
      title: title,
      contentType: "text",
    });

    const { _id } = post;

    await userModel.updateOne(
      { _id: req.user._id },
      { $push: { posts: { _id } } }
    );
    return res.status(201).json({ message: "post created sucessfully", post });
  }

  if (media) {
    if (media.mimetype.startsWith("video")) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        media.path,
        {
          folder: `FaceBook/User/posts/${Math.random()}`,
          resource_type: "video",
        }
      );
      const post = await postModel.create({
        userId: req.user._id,
        title: title ? title : "",
        content: { public_id, secure_url },
        contentType: "vedio",
      });
      const { _id } = post;

      await userModel.updateOne(
        { _id: req.user._id },
        { $push: { posts: { _id } } }
      );
      return res.json({ message: "done", post }).status(201);
    }

    if (media.mimetype.startsWith("image")) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        media.path,
        {
          folder: `FaceBook/User/posts/${Math.random()}`,
        }
      );
      const post = await postModel.create({
        userId: req.user._id,
        title: title ? title : "",
        content: { public_id, secure_url },
        contentType: "image",
      });
      const { _id } = post;

      await userModel.updateOne(
        { _id: req.user._id },
        { $push: { posts: { _id } } }
      );

      return res
        .json({ message: "post created sucessfully", post })
        .status(201);
    }
  }
});

export const handleGetPost = handleAsync(async (req, res, next) => {
  const posts = await postModel.find({ userId: req.user._id });

  res.status(200).json({ message: "post created sucessfully", posts });
});

export const handleLike = handleAsync(async (req, res, next) => {
  const { postId } = req.body;
  const post = await postModel.findById(postId);

  const updatedQuery = post.likes.includes(req.user._id)
    ? { $pull: { likes: req.user._id } }
    : { $push: { likes: req.user._id } };

  const updatedPost = await postModel.findOneAndUpdate(
    { _id: postId },
    updatedQuery
  );

  res.status(200).json({ message: "updatedSuccefully" });
});
