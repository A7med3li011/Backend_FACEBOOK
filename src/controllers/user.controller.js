import { customAlphabet } from "nanoid";
import { handleAsync } from "../../utilities/handleAsync.js";
import bcrypt from "bcrypt";
import userModel from "../../db/models/userModel.js";
import { handleError } from "../../utilities/handleError.js";
import jwt from "jsonwebtoken";
import { sender } from "../../services/sendEmail.js";
import cloudinary from "../../services/cloudinary.js";

export const handlRegister = handleAsync(async (req, res, next) => {
  const { firstName, SurName, gender, email, password, birthDate } = req.body;
  const name = `${firstName} ${SurName}`;
  const nandoId = customAlphabet("0123456789", 5);
  const randomNumbers = nandoId();
  sender(email, randomNumbers);

  const hashedPassword = await bcrypt.hash(password, +process.env.SLATROUNDS);

  const emailExist = await userModel.findOne({ email });

  if (emailExist) {
    return next(new handleError("email already exist", 409));
  }
  const userData = await userModel.create({
    name,
    gender,
    email,
    password: hashedPassword,
    birthOfDate: birthDate,
    verificationCode: randomNumbers,
  });

  res.json({
    message: "welocme Ahmed",

    data: { email: email, code: randomNumbers },
  });
});

export const handleVerification = handleAsync(async (req, res, next) => {
  const { email, code } = req.body;

  const userExist = await userModel.findOneAndUpdate(
    { email, verificationCode: code },
    { verified: true }
  );

  if (!userExist)
    return next(new handleError("code or Email is not valid", 404));

  res.status(200).json({ message: "Verified Successfully" });
});

export const handlelogin = handleAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const userExist = await userModel
    .findOne({ email, verified: true })
    .select(" -verified -verificationCode");

  if (!userExist)
    return next(new handleError("make sure you are verified frist", 404));

  const checkPassword = await bcrypt.compare(password, userExist.password);

  if (!checkPassword)
    return next(new handleError("password is incorrect", 400));

  const user = await userModel
    .findOne({ email, verified: true })
    .select(
      "-live -Studied -from -birthOfDate -password -bio -profilePic -coverPic -friends -posts -verified -verificationCode -allImages"
    );
  const token = jwt.sign({ user }, process.env.SECRETEKEY);

  res.json({ message: "done", data: token });
});

export const handleResendEmail = handleAsync(async (req, res, next) => {
  const { email } = req.body;
  const nandoId = customAlphabet("0123456789", 5);
  const randomNumbers = nandoId();
  sender(email, randomNumbers);
  const emailExsit = await userModel.findOneAndUpdate(
    { email },
    { verificationCode: randomNumbers }
  );

  if (!emailExsit) return next(new handleError("email not exist", 404));

  res.json({ message: "ressended" });
});

export const handleDetials = handleAsync(async (req, res, next) => {
  const { work, live, Studied, from } = req.body;

  await userModel.findOneAndUpdate(
    { _id: req.user._id },
    { work, live, Studied, from }
  );

  res.status(200).json({ message: "updated successfully" });
});

export const handleGetUser = handleAsync(async (req, res, next) => {
  const { id } = req.params;

  const userExist = await userModel
    .findById(id)
    .select("-verified -verificationCode -password")
    .populate("posts")
    .populate({
      path: "recieveRequests",
      select: "name profilePic",
    })
    .populate({
      path: "sendRequests",
      select: "name profilePic",
    })
    .populate({
      path: "friends",
      select: "name profilePic posts",
    });
  if (!userExist) return next(new handleError("user is not exsit", 404));

  res.status(200).json({ message: "seccess", user: userExist });
});

export const handleProfilePic = handleAsync(async (req, res, next) => {
  const image = req.files[0];

  const userExist = await userModel.findById(req.user._id);

  if (!userExist) return next(new handleError("user not found", 404));
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    image.path,
    {
      folder: `FaceBook/User/PrfilePic/${Math.random()}`,
    }
  );

  await userModel.findOneAndUpdate(
    { _id: req.user._id },
    {
      profilePic: { public_id, secure_url },

      $push: { allImages: { public_id, secure_url } },
    }
  );

  res.status(200).json({ message: "done" });
});
export const handlecoverPic = handleAsync(async (req, res, next) => {
  const image = req.files[0];
  const userExist = await userModel.findById(req.user._id);
  if (!userExist) return next(new handleError("user not found", 404));
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    image.path,
    {
      folder: `FaceBook/User/PrfilePic/${Math.random()}`,
    }
  );

  await userModel.findOneAndUpdate(
    { _id: req.user._id },
    {
      coverPic: { public_id, secure_url },

      $push: { allImages: { public_id, secure_url } },
    }
  );

  res.status(200).json({ message: "done" });
});

export const handleSearchUser = handleAsync(async (req, res, next) => {
  const { text } = req.body;

  const users = await userModel
    .find({ name: { $regex: text, $options: "i" } })
    .select("profilePic name");

  res.json({ message: "done", users });
});

export const handleSendFriendRequest = handleAsync(async (req, res, next) => {
  const { id } = req.params;

  if (id == req?.user?._id)
    return next(new handleError("send request to your account", 409));
  const senderExist = await userModel.findById(req.user._id);
  if (!senderExist) return next(new handleError("sender not exist", 404));
  const recieverExist = await userModel.findById(id);
  if (!recieverExist) return next(new handleError("reciever not exist", 404));
  if (
    recieverExist.friends.includes(req.user._id) ||
    senderExist.friends.includes(id)
  )
    return next(new handleError("you are already friends", 404));
  await userModel.findByIdAndUpdate(
    { _id: id },
    { $push: { recieveRequests: req.user._id } }
  );
  await userModel.findByIdAndUpdate(
    { _id: req.user._id },
    { $push: { sendRequests: id } }
  );

  res.status(200).json({ message: "done" });
});
export const handleacceptRequest = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const senderExist = await userModel.findById(req.user._id);
  if (!senderExist) return next(new handleError("sender not exist", 404));
  const recieverExist = await userModel.findById(id);
  if (!recieverExist) return next(new handleError("reciever not exist", 404));

  const updatedsenderExist = await userModel.findByIdAndUpdate(
    { _id: req.user._id },
    { $push: { friends: id }, $pull: { sendRequests: id } }
  );
  const updatedRecieverExist = await userModel.findByIdAndUpdate(
    { _id: id },
    {
      $push: { friends: req.user._id },
      $pull: { recieveRequests: req.user._id },
    }
  );

  res.status(200).json({ message: "done " });
});
export const handleIgnoreRequest = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const senderExist = await userModel.findById(req.user._id);
  if (!senderExist) return next(new handleError("sender not exist", 404));
  const recieverExist = await userModel.findById(id);
  if (!recieverExist) return next(new handleError("reciever not exist", 404));

  if (
    recieverExist.friends.includes(req.user._id) ||
    senderExist.friends.includes(id)
  )
    return next(new handleError("you are already friends", 409));
  const updatedsenderExist = await userModel.findByIdAndUpdate(
    { _id: req.user._id },
    { $pull: { sendRequests: id } }
  );
  const updatedRecieverExist = await userModel.findByIdAndUpdate(
    { _id: id },
    {
      $pull: { recieveRequests: req.user._id },
    }
  );
  const updatedsenderExist2 = await userModel.findByIdAndUpdate(
    { _id: req.user._id },
    { $pull: { recieveRequests: id } }
  );
  const updatedRecieverExist2 = await userModel.findByIdAndUpdate(
    { _id: id },
    {
      $pull: { sendRequests: req.user._id },
    }
  );

  res.status(200).json({ message: "done " });
});

export const handleRemoveFreind = handleAsync(async (req, res, next) => {
  const { id } = req.params;
  const senderExist = await userModel.findById(req.user._id);
  if (!senderExist) return next(new handleError("sender not exist", 404));
  const recieverExist = await userModel.findById(id);
  if (!recieverExist) return next(new handleError("reciever not exist", 404));

  if (
    !recieverExist.friends.includes(req.user._id) ||
    !senderExist.friends.includes(id)
  )
    return next(new handleError("you are already not friends", 409));
  const updatedsenderExist = await userModel.findByIdAndUpdate(
    { _id: req.user._id },
    { $pull: { friends: id } }
  );
  const updatedRecieverExist = await userModel.findByIdAndUpdate(
    { _id: id },
    {
      $pull: { friends: req.user._id },
    }
  );

  res.status(200).json({ message: "done " });
});
