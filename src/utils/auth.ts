import jwt from "jsonwebtoken";

export const signJWToken = (id: string) => {
  return jwt.sign(
    {
      data: id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "3h",
    },
  );
};
