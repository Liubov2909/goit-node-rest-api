import bcrypt from "bcryptjs";
import HttpError from "../helpers/HttpError.js";
import { User } from "../db/models/users.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res, next) => { 
 const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }
   const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashPassword,
    });
    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: req.body.subscription || "starter",
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
