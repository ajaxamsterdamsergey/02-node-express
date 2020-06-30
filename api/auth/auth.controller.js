/* import bcrypt from 'bcrypt';
import {salt} from '../config';
import {LognValidation} from './auth.validator';
import User from '../users/user.model';
import {createToken} from '../services/auth.service';
import {sendVerificationToken} from '../services/mail.service';
import jwt from 'jsonwebtoken'; */
import bcrypt from "bcryptjs";
import { salt } from "../config";
import { LognValidation } from "./auth.validator";
import contactModel from "../contacts/contact.model";
import { createToken } from "../services/auth.service";
/* import {sendVerificationToken} from '../services/mail.service'; */
import jwt from "jsonwebtoken";
export const registrationController = async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const user = { ...req.body, password: hashPassword, role: "USER" };
    await contactModel.createContact(user);
    res.status(201).send("User created");
    /*  const { isActive, ...data } = req.body;
    const user = { ...data, password: hashPassword, role: "USER" };
    const { _id, email } = await contactModel.createContact(user); */
    /*  await sendVerificationToken(_id, email); */
    /*  res.status(201).send("User created"); */
    /* res.json(user); */
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal server error");
  }
};

export const loginController = async (req, res) => {
  try {
    const { error } = await LognValidation(req.body);
    if (error) {
      res.status(400).send("Bad request");
      return;
    }
    const { email, password } = req.body;
    const user = await contactModel.findContactByEmail(
      email
    ); /* User.getUser({email}) */
    if (!user) {
      res.status(400).send("User not found");
      return;
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(400).send("Wrong password");
      return;
    }
    /*   if (!user.isActive) {
      res.status(403).send("User is not active");
      return;
    } */
    const token = await createToken({ id: user._id, role: user.role });
    res.json({ token });
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal server error");
  }
};

/* export const verifyController = async (req, res) => {
  const verifyToken = req.params.token;

  if (!verifyToken) {
    res.status(401).send("No token provided");
    return;
  }

  try {
    const { id } = await jwt.verify(
      verifyToken,
      process.env.PRIVATE_KEY_VERIFICATION
    );

    await User.updateUser({
      id,
      isActive: true,
    });
    res.redirect("http://localhost:3000/login.html");
  } catch (e) {
    res.status(401).send("Invalid token");
  }
};
 */
