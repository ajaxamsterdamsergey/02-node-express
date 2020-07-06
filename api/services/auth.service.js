import jwt from "jsonwebtoken";

export const createToken = async (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET);
};
