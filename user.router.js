const { Router } = require("express");
const Joi = require("@hapi/joi");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs")

const contactsPath = path.join(__dirname, "/db/contacts.json");
console.log(contactsPath);

const artists = fs.readFileSync(contactsPath, 'utf-8');
const artistArr = JSON.parse(artists);
console.log(artistArr);

// id - string
// username - string
// email - string
// password - string

/* const usersDB = []; */

const usersRouter = Router();

// C - Create
usersRouter.post("/"/* , validateCreateUser */, createUser);

// R - Read
usersRouter.get("/", getAllUsers);
usersRouter.get("/:id", getUser);

// U - Update
usersRouter.put("/:id", /* validateUpdateUser, */ updateUser);

// D - Delete
usersRouter.delete("/:id", deleteUser);

module.exports = usersRouter;

function validateCreateUser(req, res, next) {
  const body = req.body;

  const userRules = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const validationResult = userRules.validate(body);
  if (validationResult.error) {
    return res.status(400).json(validationResult.error);
  }

  next();
}

/* function createUser(req, res, next) {
  try {
    // 1. Validate request body +
    // 2. create id for user +
    // 3. save user to usersDB +
    // 4. send 201 response +

    const id = uuid.v4();

    const createdUser = {
      ...req.body,
      id,
    };

    
    usersDB.push(createdUser);

    return res.status(201).json(createdUser);
  } catch (err) {
    next(err);
  }
} */
function createUser(req, res) {
	let newArtist = {
		id: Date.now(),
		name: req.body.name
	};
	const artistaUpd = JSON.stringify([ ...artistArr, newArtist ]);
	fs.writeFile(contactsPath, artistaUpd, function(err) {
		if (err) return res.send(err);
		res.send(newArtist);
	});
	// res.send('post a new user');
}

function getAllUsers(req, res, next) {
  // 1. return all users in response
  return res.status(200).json(artistArr);
}

function getUser(req, res, next) {
  // 1. getUser from userDB by id
  // 2. if user not found - return 404 error
  // 3. if user found - send 200 response

  const userFound = artistArr.find((user) => user.id === Number(req.params.id));
  if (!userFound) {
    return res.status(404).send("User not found");
  }

  /* return res.status(200).json(userFound); */
  return res.status(200).send(userFound);
}

function validateUpdateUser(req, res, next) {
  const body = req.body;

  const userRules = Joi.object({
    username: Joi.string(),
    email: Joi.string(),
  });

  const validationResult = userRules.validate(body);
  if (validationResult.error) {
    return res.status(400).json(validationResult.error);
  }

  next();
}
function updateUser (req, res){
    console.log(req.body);
    
    const contacts=artistArr.find((contacts) => contacts.id === Number(req.params.id))
    contacts.name=req.body.name;
    res.send(contacts);
}
/* function updateUser(req, res, next) {
    const contact = artistArr.findIndex((item) => item.id == id);
    if (contact == -1) {
      resp.status(404).send({ message: "Not found" });
    } else {
      Object.assign(artistArr[contact], { ...req.body });
      fs.writeFile(contactsPath, JSON.stringify(artists), function(err) {
		if (err) return res.send(err);
		res.send(artistArr[contact]);
    });}
} */
 /*  try {
    // 1. validate request body +
    // 2. getUser index from userDB by id +
    // 3. if user not found - return 404 error +
    // 4. if user found - update user +
    // 5. send response with 200 and updated user

    const userIndexFound = findUserIndex(req.params.id);

    artistArr[userIndexFound] = {
      ...artistArr[userIndexFound],
      ...req.body,
    };

    return res.status(200).json(artistArr[userIndexFound]);
  } catch (err) {
    next(err);
  } */
/* } */
/* function deleteUser(req, res) {
	const artists = artistArr.filter((artist) => artist.id !== Number(req.params.id));

	fs.writeFile(contactsPath, JSON.stringify(artists), function(err) {
		if (err) return res.send(err);
		res.send(artists);
	});
} */
/* function updateUser(req, res, next){
    try{
        const artists = artistArr.filter((artist) => artist.id === Number(req.params.id));
        artistArr[artists] = {
            ...artistArr[artists],
            ...req.body,
          };
          fs.writeFile(contactsPath, JSON.stringify(artists), function(err) {
            if (err) return res.send(err);
            res.send(artistArr[artists]);
        })
          return res.status(200).json(artistArr[artists]);
    }catch (err) {
        next(err);
      }
} */
function deleteUser(req, res,next) {
    try{
	const artists = artistArr.filter((artist) => artist.id !== Number(req.params.id));

	fs.writeFile(contactsPath, JSON.stringify(artists), function(err) {
		if (err) return res.send(err);
		res.send(artists);
	})}catch (err) {
        next(err);
      }
}
/* function deleteUser(req, res, c) {
  try { */
    // 1. getUser index from userDB by id +
    // 2. if user not found - send 404 error +
    // 3. if user found - delete user from usersDB +
    // 4. send 204 response

    /* const userIndexFound = findUserIndex(req.params.id); */

  /*   const userIndexFound= artistArr.filter((user) => user.id === Number(req.params.id));

    artistArr.splice(userIndexFound, 1);

    return res.status(204).send();
    
  } catch (err) {
    next(err);
  }
}
 */
function findUserIndex(req,userId) {
  const userIndexFound = artistArr.findIndex((artist) => artist.id === req.params.id);
  if (userIndexFound === -1) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  return userIndexFound;
}

  