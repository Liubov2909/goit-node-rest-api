import { isValidObjectId } from "mongoose";
import HttpError from "../helpers/HttpError.js";

export const checkId = (req, res, next) => {
    const {id} = req.params;
    if(!isValidObjectId(id)) {
        next(HttpError(404))
    }
    next();
}
    