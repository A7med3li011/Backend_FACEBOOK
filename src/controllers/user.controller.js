import { customAlphabet } from "nanoid";
import { handleAsync } from "../../utilities/handleAsync.js";
import bcrypt from "bcrypt";
import userModel from "../../db/models/userModel.js";
import { handleError } from "../../utilities/handleError.js";
import jwt from "jsonwebtoken";

export const handlRegister = handleAsync(async (req, res, next) => {
  const { firstName, SurName, gender, email, password, birthDate } = req.body;
  const name = `${firstName} ${SurName}`;
  const nandoId = customAlphabet("0123456789", 5);
  const randomNumbers = nandoId();

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

    data: userData,
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
    .select("-verified -verificationCode -password");
  const token = jwt.sign({ user }, process.env.SECRETEKEY);

  res.json({ message: "done", data: token });
});

export const handleResendEmail = handleAsync(async (req, res, next) => {
  const { email } = req.body;
  const nandoId = customAlphabet("0123456789", 5);
  const randomNumbers = nandoId();
  const emailExsit = await userModel.findOneAndUpdate(
    { email },
    { verificationCode: randomNumbers }
  );

  if (!emailExsit) return next(new handleError("email not exist", 404));

  res.json({ message: "ressended" });
});
