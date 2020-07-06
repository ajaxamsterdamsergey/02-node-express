const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");
const Joi = require("joi");
const PORT = 3006;
const MONGODB_URL =
  "mongodb+srv://ajax:ajax1927@nodejs-4bocx.mongodb.net/test?retryWrites=true&w=majority";
const DB_NAME = "db-contacts";
let db, userCollection;

async function main() {
  const server = express();
  const client = await MongoClient.connect(MONGODB_URL);
  db = client.db(DB_NAME);
  userCollection = db.collection("contacts");
  server.use(express.json());

  server.post("/users", validateCreateUser, createUser);
  server.get("/users", getUsers);
  server.get("/users/:id", getUsersById);
  server.delete("/users/:id", deleteUserById);
  server.patch("/users/:id", validateUpdateUser, updateUserById);

  server.listen(PORT, () => {
    console.log("Server listening on port", PORT);
  });
}
function validateCreateUser(req, res, next) {
  const validateRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    subscription: Joi.string().required(),
    password: Joi.string().required(),
    token: Joi.string().required(),
  });
  const validationResult = Joi.validate(req.body, validateRules);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }
  next();
}
function validateUpdateUser(req, res, next) {
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
async function createUser(req, res, next) {
  try {
    const newUser = await userCollection.insert(req.body);
    return res.status(201).json(newUser.ops[0]);
  } catch (err) {
    next(err);
  }
}
async function getUsers(req, res, next) {
  try {
    const users = await userCollection.find().toArray();
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}
async function getUsersById(req, res, next) {
  try {
    const userId = req.params.id;
    if (!ObjectID.isValid(userId)) {
      return res.status(404).send();
    }
    const user = await userCollection.findOne({ _id: new ObjectID(userId) });
    if (!user) {
      return res.status(404).send();
    }
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
async function deleteUserById(req, res, next) {
  try {
    const userId = req.params.id;
    if (!ObjectID.isValid(userId)) {
      return res.status(404).send();
    }
    const deleteResult = await userCollection.deleteOne({
      _id: new ObjectID(userId),
    });
    if (!deleteResult.deletedCount) {
      return res.status(404).send();
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
async function updateUserById(req, res, next) {
  try {
    const userId = req.params.id;
    if (!ObjectID.isValid(userId)) {
      return res.status(404).send();
    }
    const updateResult = await userCollection.updateOne(
      {
        _id: new ObjectID(userId),
      },
      {
        $set: req.body,
      }
    );
    if (!updateResult.modifiedCount) {
      return res.status(404).send();
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
main();
