const Joi = require("joi");
const contactModel = require("./contact.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  Types: { ObjectId },
} = require("mongoose");
class ContactController {
  constructor() {
    this._costFactor = 4;
  }
  get createContacts() {
    return this._createContacts.bind(this);
  }
  async _createContacts(req, res, next) {
    try {
      const { password, name, email, phone, subscription, token } = req.body;
      const passwordHash = await bcryptjs.hash(password, this._costFactor);
      const existingUser = await contactModel.findContactByEmail(email);
      if (existingUser) {
        return res.status(409).send("User with such email already exist");
      }
      const contact = await contactModel.createContact({
        name,
        email,
        password: passwordHash,
        phone,
        subscription,
        token,
      });
      return res.status(201).json({
        id: contact._id,
        name: contact.name,
        /* password: contact.password, */
        email: contact.email,
        phone: contact.phone,
        subscription: contact.subscription,
        token: contact.token,
      });
    } catch (err) {
      next(err);
    }
  }
  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const contact = await contactModel.findContactByEmail(email);
      if (!contact) {
        return res.status(400).send("Authentication failed");
      }
      const isPasswordValid = await bcryptjs.compare(
        password,
        contact.password
      );
      if (!isPasswordValid) {
        return res.status(403).send("Authentication failed");
      }
      const token = await jwt.sign({ id: contact._id }, "oigfdytf");
      await contactModel.updateToken(contact._id, token);
      return res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
  }
  async getContacts(req, res, next) {
    try {
      /* const users = await userModel.find() */
      return res.status(200).json(await contactModel.getAllContacts());
    } catch (err) {
      next(err);
    }
  }
  async getContactsById(req, res, next) {
    try {
      const userId = req.params.id;

      const contact = await contactModel.getContactById(req.params.id);
      if (!contact) {
        return res.status(404).send();
      }
      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }
  async deleteContactsById(req, res, next) {
    try {
      /* const userId=req.params.id */

      const deletedContact = await contactModel.deleteContact(req.params.id);
      if (!deletedContact) {
        return res.status(404).send();
      }
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
  async updateContactsById(req, res, next) {
    try {
      /* const userId=req.params.id */

      const contactToUpdate = await contactModel.updateContact(
        req.params.id,
        req.body /* findByIdAndUpdate(userId,{$set:req.body},{new:true,} */
      );
      console.log(contactToUpdate);
      if (!contactToUpdate) {
        return res.status(404).send();
      }
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
  validateId(req, res, next) {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).send();
    }
    next();
  }
  validateCreateUser(req, res, next) {
    const body = req.body;

    const userRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      subscription: Joi.string(),
      password: Joi.string(),
      token: Joi.string(),
    });

    const validationResult = userRules.validate(body);
    if (validationResult.error) {
      return res.status(400).json(validationResult.error);
    }

    next();
  }
  validateUpdateUser(req, res, next) {
    const validateRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      subscription: Joi.string(),
      password: Joi.string(),
      token: Joi.string(),
    });
    const validationResult = Joi.validate(req.body, validateRules);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }
    next();
  }
  validateSignIn(req, res, next) {
    const signInRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validationResult = /* userRules */ Joi.validate(
      req.body,
      signInRules
    );
    if (validationResult.error) {
      return res.status(400).json(validationResult.error);
    }

    next();
  }
}

module.exports = new ContactController();
