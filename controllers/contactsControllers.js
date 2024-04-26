import  HttpError  from "../helpers/HttpError.js"
import { createContactSchema } from "../schemas/contactsSchemas.js";
import contactsService from "../services/contactsServices.js";



export const getAllContacts = async (req, res) => {
  const result = await contactsService.listContacts();
  res.json(result);
};

export const getOneContact = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const contact = await contactsService.getContactById(contactId);
    if (!contact) throw HttpError(404);
    else res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const contact = await contactsService.removeContact(contactId);
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

export const updateContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await contactsService.updateContact(contactId, req.body);
    if (!contact) throw HttpError(404);
    res.json(contact);
  } catch (error) {
    next(error);
  }
};