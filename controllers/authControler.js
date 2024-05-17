import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "path";
import Jimp from "jimp";
import fs from "fs/promises";


import HttpError from "../helpers/HttpError.js";
import { User } from "../db/models/users.js";

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

    const newUser = await User.create({
      email,
      password: hashPassword,
      avatarURL,
    });
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

export const loginUser = async (req, res, next) => { 
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw HttpError(401, "Email or password is wrong");
    
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
      throw new HttpError(400, "File is missing");
    }
  const { _id } = req.user;
  const { path: tmpUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  const image = await Jimp.read(tmpUpload);
  await image.resize(250, 250).writeAsync(resultUpload);
  await fs.rename(tmpUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
  } catch (error) {
    next(error);
}
};