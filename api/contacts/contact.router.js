const { Router } = require("express");
const contactController = require("./contact.controller");
import {
  tokenMiddleware,
  roleMiddleware,
} from "../middlewares/auth.middleware";

const contactsRouter = Router();

contactsRouter.post(
  "/",
  tokenMiddleware,
  /* roleMiddleware(["USER", "ADMIN"]), */
  contactController.validateCreateUser,
  contactController.createContacts
);

contactsRouter.get(
  "/current",
  tokenMiddleware,
  /* roleMiddleware(["USER", "ADMIN"]), */
  contactController.authorize,
  contactController.getCurrentContact
);
contactsRouter.get(
  "/",
  tokenMiddleware,
  roleMiddleware(["USER", "ADMIN"]),
  contactController.getContacts
);
contactsRouter.get(
  "/:id",
  tokenMiddleware,
  /* roleMiddleware(["USER", "ADMIN"]), */
  contactController.validateId,
  contactController.getContactsById
);
contactsRouter.put(
  "/sign-in",
  tokenMiddleware,
  contactController.validateSignIn,
  contactController.signIn
);
contactsRouter.delete(
  "/:id",
  tokenMiddleware,
  /* roleMiddleware(["USER", "ADMIN"]), */
  contactController.validateId,
  contactController.deleteContactsById
);
contactsRouter.patch(
  "/logout",
  tokenMiddleware,
  contactController.authorize,
  /* contactController.validateId, */
  contactController.logout
);
contactsRouter.patch(
  "/:id",
  tokenMiddleware,
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
