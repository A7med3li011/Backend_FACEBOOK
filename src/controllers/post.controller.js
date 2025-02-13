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
  const { userId } = req.params;
  const posts = await postModel

    .find({ userId })
    .populate({
      path: "userId",
      select: "profilePic name",
    })
    .populate({
      path: "comments.user",
      select: "profilePic name",
    });

  if (!posts.length) return next(new handleError("there is no posts yet", 404));

  res.status(200).json({ message: "done", posts });
});

export const handleLike = handleAsync(async (req, res, next) => {
  const { postId } = req.body;
  const post = await postModel.findById(postId);

  if (!post) return next(new handleError("post is not Exist"));

  const updatedQuery = post.likes.includes(req.user._id)
    ? { $pull: { likes: req.user._id } }
    : { $push: { likes: req.user._id } };

  const updatedPost = await postModel.findOneAndUpdate(
    { _id: postId },
    updatedQuery
  );

  res.status(200).json({ message: "updatedSuccefully" });
});

export const handlecommet = handleAsync(async (req, res, next) => {
  const { postId, text } = req.body;
  const userExist = await userModel.findById(req.user._id);

  if (!userExist) return next(new handleError("user not found", 404));

  const postExist = await postModel.findById(postId);
  if (!postExist) return next(new handleError("post  not found", 404));

  const updatedPost = await postModel.findByIdAndUpdate(
    { _id: postId },
    { $push: { comments: { user: req.user._id, text } } },
    { new: true }
  );

  res.json({ message: "done", updatedPost });
});

export const handleGetcommet = handleAsync(async (req, res, next) => {
  const postId = req.body;
  const postExist = await postModel.findById(postId).populate({
    path: "comments.user",
    select: "profilePic name",
  });
  if (!postExist) return next(new handleError("post not exist", 404));
});

export const handleSavepost = handleAsync(async (req, res, next) => {
  const { id } = req.params;

  const postExsit = await postModel.findById(id);
  if (!postExsit) return next(new handleError("post not exist", 404));

  const user = await userModel.findById(req.user._id);
  const updatedQuery = user.savedPosts.includes(id)
    ? { $pull: { savedPosts: id } }
    : { $push: { savedPosts: id } };

  await userModel.findByIdAndUpdate({ _id: req.user._id }, updatedQuery);

  res.json({ message: "saved successfully" });
});

export const handleDeletedPost = handleAsync(async (req, res, next) => {
  const { id } = req.params;

  const postExsit = await postModel.findById(id);
  if (!postExsit) return next(new handleError("post not exist", 404));

  if (postExsit.userId != req.user._id)
    return next(new handleError("Unauthorized action", 401));

  await postModel.findByIdAndDelete(id);

  res.json({ message: "deleted successfully" });
});

export const getSavedPosts = handleAsync(async (req, res, next) => {
  const userExist = await userModel
    .findById(req.user._id)
    .select("savedPosts -_id");
  if (!userExist) return next(new handleError("user not found", 404));

  let postsIds = [...JSON.parse(JSON.stringify(userExist.savedPosts))];

  const savedPosts = await postModel.find({ _id: { $in: postsIds } }).populate({
    path: "userId",
    select: "name profilePic",
  });

  res.json({ message: "done", savedPosts });
});
