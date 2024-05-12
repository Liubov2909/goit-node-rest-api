import { Contact } from "../db/models/contact.js";

const listContacts = async (owner, skip, limit) => {
  return Contact.find({ owner }, "", { skip, limit });
};

const getContactById = async (id, owner) => {
  return Contact.findOne({ _id: id, owner });
};

const removeContact = async (id, owner) => {
  return Contact.findOneAndDelete({ _id: id, owner });
};

const addContact = (body) => Contact.create(body);

const updateContact = async (id, data, owner) => {
  return Contact.findOneAndDelete({ _id: id, owner }, data, { new: true });
};

const updateStatusContact = async (id, status, owner) => {
  return Contact.findOneAndDelete(
    { _id: id, owner },
    { favorite: status },
    { new: true }
  );
};

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};