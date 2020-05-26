const { Router } = require("express");
const Joi = require("@hapi/joi");
const { v4: uuidv4 } = require('uuid');
const path = require("path");
const fs = require("fs")

const contactsPath = path.join(__dirname, "/db/contacts.json");
console.log(contactsPath);

const users = fs.readFileSync(contactsPath, 'utf-8');
const usersArr = JSON.parse(users);
console.log(usersArr);

const usersRouter = Router();

usersRouter.post("/", validateCreateUser, createUser);

usersRouter.get("/", getAllUsers);
usersRouter.get("/:id", getUser);

usersRouter.patch("/:id", validateUpdateUser, updateUser);

usersRouter.delete("/:id", deleteUser);


function validateCreateUser(req, res, next) {
  const body = req.body;

  const userRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });

  const validationResult = userRules.validate(body);
  if (validationResult.error) {
    return res.status(400).json("missing required name field"/* validationResult.error */);
  }

  next();
}
function validateUpdateUser(req, res, next) {
  const body = req.body;

  const userRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string()
  });

  const validationResult = userRules.validate(body);
  if (validationResult.error) {
    return res.status(400).json(validationResult.error);
  }

  next();
}

function getAllUsers(req, res, next) {
  return res.status(200).json(usersArr);
}

function getUser(req, res, next) {
 const userFound = usersArr.find((user) => user.id === Number(req.params.id));
  if (!userFound) {
    return res.status(404).send("User not found");
  }
  return res.status(200).send(userFound);
}

function createUser(req, res) {
	let newUser = {
		id: uuidv4(),
    name: req.body.name,
    phone: req.body.phone,
    email:req.body.email
	};
	const userUpd = JSON.stringify([ ...usersArr, newUser ]);
	fs.writeFile(contactsPath, userUpd, function(err) {
		if (err) return res.send(err);
		res.status(201).send(newUser);
	});
}




function updateUser (req, res){
    console.log(req.body);
    
    const contacts=usersArr.find((contacts) => contacts.id === Number(req.params.id))
    contacts.name=req.body.name;
    contacts.phone=req.body.phone;
    contacts.email=req.body.email;
    res.send(contacts);
}

function deleteUser(req, res,next) {
    try{
  const users = usersArr.filter((user) => user.id !== Number(req.params.id));

	fs.writeFile(contactsPath, JSON.stringify(users), function(err) {
		if (err) return res.send(err);
		res.send(users);
	})}catch (err) {
        next(err);
      }
}


module.exports = usersRouter;
  