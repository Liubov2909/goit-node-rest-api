import  HttpError  from "../helpers/HttpError.js"
import { createContactSchema } from "../schemas/contactsSchemas.js";
import contactsService from "../services/contactsServices.js";



export const getAllContacts = async (req, res) => {
  const result = await contactsService.listContacts();
  res.json(result);
};

export const getOneContact = async (req, res, next) => {
  try {
    const {id} = req.params;
    const contact = await contactsService.getContactById(id);
    if (!contact) throw HttpError(404);
    else res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const {id} = req.params;
    const contact = await contactsService.removeContact(id);
    if (!contact) throw HttpError(404);
    else res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const schema = createContactSchema.validate(req.body);
    if (schema.error) {
throw HttpError(400, schema.error.details[0].message);
    }
    const { name, email, phone } = req.body;
    const contact = await contactsService.addContact(name, email, phone);
    res.status(201).json(contact);
  } catch (error) {
    next(error)
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.updateContact(id, req.body);
    if (!contact) throw HttpError(404);
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.updateStatusContact(id, req.body.favorite);
    if (!contact) throw HttpError(404);
    res.json(contact)
  } catch (error) {
    next(error);
  }
};