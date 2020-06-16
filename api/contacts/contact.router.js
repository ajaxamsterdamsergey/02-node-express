const { Router } = require("express");
const contactController = require("./contact.controller");

const contactsRouter = Router();

contactsRouter.post(
  "/",
  contactController.validateCreateUser,
  contactController.createContacts
);

contactsRouter.get("/", contactController.getContacts);
contactsRouter.get(
  "/:id",
  contactController.validateId,
  contactController.getContactsById
);
contactsRouter.put(
  "/sign-in",
  contactController.validateSignIn,
  contactController.signIn
);
contactsRouter.delete(
  "/:id",
  contactController.validateId,
  contactController.deleteContactsById
);

contactsRouter.patch(
  "/:id",
  contactController.validateId,
  contactController.validateUpdateUser,
  contactController.updateContactsById
);

module.exports = contactsRouter;
/* // C - Create
usersRouter.post(
  "/",
  userController.validateCreateUser,
  userController.createUser
);

// R - Read
usersRouter.get("/", userController.getAllUsers);
usersRouter.get("/:id", userController.validateGetUser, userController.getUser);

// U - Update
usersRouter.put(
  "/:id",
  userController.validateUpdateUser,
  userController.updateUser
);

// D - Delete
usersRouter.delete(
  "/:id",
  userController.validateDeleteUser,
  userController.deleteUser
);

export default usersRouter; */
