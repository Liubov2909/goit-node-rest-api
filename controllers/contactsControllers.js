import  HttpError  from "../helpers/HttpError.js"
import contactsService from "../services/contactsServices.js";


export const getAllContacts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const owner = req.user._id;
  console.log(owner);
  res.json(await contactsService.listContacts(owner, skip, limit));
};

export const getOneContact = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { id } = req.params;
    const contact = await contactsService.getContactById(id, owner);
    if (!contact) throw HttpError(404);
    else res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { id } = req.params;
    const contact = await contactsService.removeContact(id, owner);
    if (!contact) throw HttpError(404);
    else res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const contact = await contactsService.addContact({ ...req.body, owner });
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { id } = req.params;
    const contact = await contactsService.updateContact(id, req.body, owner);
    if (!contact) throw HttpError(404);
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateFavorite = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { id } = req.params;
    const contact = await contactsService.updateStatusContact(
      id,
      req.body.favorite,
      owner
    );
    if (!contact) throw HttpError(404);
    res.json(contact);
  } catch (error) {
    next(error);
  }
};