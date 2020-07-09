const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
  /* _id: Schema.Types.ObjectId, */
  /* name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  subscription: { type: String, required: true },
  token: { type: String, required: false }, */
  name: String,
  email: String,
  password: String,
  role: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  avatar: {type: String, default: ''},
  token: String,
});

contactSchema.statics.createContact = createContact;
contactSchema.statics.getAllContacts = getAllContacts;
contactSchema.statics.updateContact = updateContact;
contactSchema.statics.getContactById = getContactById;
contactSchema.statics.deleteContact = deleteContact;
contactSchema.statics.findContactByEmail = findContactByEmail;
contactSchema.statics.updateToken = updateToken;
contactSchema.static.getUser = getUser;

async function getUser(query) {
  return this.user.findOne(query);
}

async function createContact(contactParams) {
  return this.create(contactParams);
}

async function getAllContacts() {
  return this.find();
}

async function getContactById(contactId) {
  return this.findById(contactId);
}

async function updateContact(contactId, contactParams) {
  return this.findByIdAndUpdate(
    contactId,
    {
      $set: contactParams,
    },
    { new: true }
  );
}

async function deleteContact(contactId) {
  return this.findByIdAndDelete(contactId);
}
async function findContactByEmail(email) {
  return this.findOne({ email });
}
async function updateToken(id, newToken) {
  return this.findByIdAndUpdate(id, { token: newToken });
}
const contactModel = mongoose.model("Contacts", contactSchema);
module.exports = contactModel;
