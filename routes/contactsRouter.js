import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateFavorite,
} from "../controllers/contactsControllers.js";

import { createContactSchema, updateContactSchema, updateFavoriteSchema } from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";
import { checkId } from "../middlewares/checkId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", checkId, getOneContact);

contactsRouter.delete("/:id", checkId, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", checkId, validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", checkId, validateBody(updateFavoriteSchema), updateFavorite);

export default contactsRouter;