import jwt from "jsonwebtoken";

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET_KEY, {
    expiresIn: "5d",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: "10d",
  });
};

export { generateAccessToken, generateRefreshToken };
