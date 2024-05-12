import HttpError from "../helpers/HttpError.js";
import jwt from "jsonwebtoken";
import { User } from "../db/models/users.js";

export const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") return next(HttpError(401, "Not authorized"));
  try {
    const { id } = jwt.verify(token, process.env.SECRET_KEY);
    console.log(id);
    const user = await User.findOne({ _id: id });
    if (!user || !user.token || user.token !== token) {
      return next(HttpError(401, "Not authorized"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};