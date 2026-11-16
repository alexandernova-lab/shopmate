import jwt from "jsonwebtoken";

export const generateToken = (id) => {
  const maxAge = 3 * 24 * 60 * 60 * 1000;
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};
