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
import { authenticate } from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, checkId, getOneContact);

contactsRouter.delete("/:id", authenticate, checkId, deleteContact);

contactsRouter.post("/", authenticate, validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", authenticate, checkId, validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", authenticate, checkId, validateBody(updateFavoriteSchema), updateFavorite);

export default contactsRouter;