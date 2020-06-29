import jwt from "jsonwebtoken";
import contactModel from "../contacts/contact.model";

export const tokenMiddleware = async (req, res, next) => {
  const { authorization: token } = req.headers;

  if (!token) {
    res.status(401).send("No token provided");
    return;
  }

  try {
    const { id } = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await contactModel.getContactById(id);
        if (!user) {
            res.status(401).send('Invalid token')
        }
    req.userInfo = { id, role: user.role };
    next();
  } catch (e) {
    console.log(e);

    res.status(401).send("Invalid token");
  }
};

export const roleMiddleware = (roleList) => (req, res, next) => {
  const { role } = req.userInfo;
  console.log(req.userInfo);
  if (!roleList.includes(role)) {
    res.status(403).send("Forbiden");

    return;
  }
  next();
};
