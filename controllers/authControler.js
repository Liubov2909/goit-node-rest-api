import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "path";
import Jimp from "jimp";
import fs from "fs/promises";
import { nanoid } from "nanoid";

import HttpError from "../helpers/HttpError.js";
import { User } from "../db/models/users.js";
import { sendEmail } from "../helpers/sendEmail.js";


const { BASE_URL } = process.env;
const avatarsDir = path.resolve('public', 'avatars');

export const registerUser = async (req, res, next) => { 
 const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const newUser = await User.create({
      email,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const verificationEmail = {
      to: email,
      from: "ostapcuk@ua.fm",
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`
    };
    await sendEmail(verificationEmail);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: req.body.subscription || "starter",
        avatarURL,
      },
    });
} catch (error) {
  next(error);
}
};

export const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;
  try {
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });

    res.json({ message: "Verification successful" });

  } catch (error) {
    next(error);
  }
}

export const resendVerifyEmail = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    throw HttpError(400, "Missing required field email");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(404, "User not found");
    };
    if (user.verify) {
      throw HttpError(400, "Verification has already been passed")
    };

    const verificationEmail = {
      to: email,
      from: "ostapcuk@ua.fm",
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`
    };

    await sendEmail(verificationEmail);

    res.json({ message: "Verification email sent successfully" });

  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => { 
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw HttpError(401, "Email or password is wrong");

     if(!user.verify) throw HttpError(401, "Email not verified");
    
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) throw HttpError(401, "Email or password is wrong");
    
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" },
    );

    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res) => { 
  const { _id } = req.user;
  try {
    await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const currentUser = async(req, res) => { 
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

export const updateAvatars = async (req, res, next) => {
  try { 
    if (!req.file) {
      throw HttpError(400, "File is missing");
    }
  const { _id } = req.user;
  const { path: tmpUpload, originalname } = req.file;
  
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  const image = await Jimp.read(tmpUpload);
  await image.resize(250, 250).writeAsync(tmpUpload);
  await fs.rename(tmpUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
  } catch (error) {
    next(error);
}
};