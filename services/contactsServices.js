import { Contact } from "../db/models/contact.js";

const listContacts = () => Contact.find();

const getContactById = (id) => Contact.findOne({ _id: id });

const removeContact = (id) => Contact.findOneAndDelete({ _id: id });

const addContact = (name, email, phone) => Contact.create({ name, email, phone });

const updateContact = (id, data) => Contact.findByIdAndUpdate({ _id: id }, data, { new: true });

const updateStatusContact =  (id, status) => Contact.findByIdAndUpdate(
    { _id: id },
    { favorite: status },
    { new: true }
  );

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};