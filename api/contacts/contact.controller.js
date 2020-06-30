const Joi = require("joi");
const contactModel = require("./contact.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../helpers/errors.constuctor");
const {
  Types: { ObjectId },
} = require("mongoose");
const _ = require("lodash");
const { json } = require("express");
class ContactController {
  constructor() {
    this._costFactor = 4;
  }
  get createContacts() {
    return this._createContacts.bind(this);
  }
  get getContactsById() {
    return this._getContactsById.bind(this);
  }
  get getContacts() {
    return this._getContacts.bind(this);
  }
  get getCurrentContact() {
    return this._getCurrentContact.bind(this);
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
      const token = await jwt.sign(
        { id: contact._id },
        process.env.JWT_SECRET,
        { expiresIn: 2 * 24 * 60 * 60 }
      );
      await contactModel.updateToken(contact._id, token);
      return res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
  }
  async _getContacts(req, res, next) {
    try {
      const contacts = await contactModel.find();
      /* return res.status(200).json(await contactModel.getAllContacts()); */
      return res.status(200).json(this.prepareContactsResponse(contacts));
    } catch (err) {
      next(err);
    }
  }
  async _getContactsById(req, res, next) {
    try {
      const contactId = req.params.id;

      /* const contact = await contactModel.getContactById(req.params.id); */
      const contact = await contactModel.findById(contactId);
      if (!contact) {
        return res.status(404).send();
      }
      const [contactForResponse] = this.prepareContactsResponse([contact]);
      return res.status(200).json(contactForResponse);
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
  async logout(req, res, next) {
    try {
      const contact = req.contact;
      await contactModel.updateToken(contact._id, null);
      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
  async _getCurrentContact(req, res, next) {
    const [contactForResponse] = this.prepareContactsResponse([req.contact]);
    return res.status(200).json(contactForResponse);
  }
  async authorize(req, res, next) {
    try {
      // 1. витягнути токен користувача з заголовка Authorization
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");

      // 2. витягнути id користувача з пейлоада або вернути користувачу
      // помилку зі статус кодом 401
      let conactId;
      try {
        conactId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        next(new UnauthorizedError("User not authorized"));
      }

      // 3. витягнути відповідного користувача. Якщо такого немає - викинути
      // помилку зі статус кодом 401
      // userModel - модель користувача в нашій системі
      const contact = await contactModel.findById(conactId);
      if (!contact || contact.token !== token) {
        throw new UnauthorizedError("user not authorized");
      }

      // 4. Якщо все пройшло успішно - передати запис користувача і токен в req
      // і передати обробку запиту на наступний middleware
      req.contact = contact;
      req.token = token;

      next();
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
  prepareContactsResponse(contacts) {
    return contacts.map((contact) => {
      const { name, email, phone, subscription, _id } = contact;
      return { id: _id, name, email, phone, subscription };
    });
  }
}

module.exports = new ContactController();
