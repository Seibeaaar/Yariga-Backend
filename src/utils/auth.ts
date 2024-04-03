import jwt from "jsonwebtoken";
import { USER_ROLE } from "@/enums/user";

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

export const generateRoleBasedFields = (role: USER_ROLE) => {
  switch (role) {
    case USER_ROLE.Sole:
      return {
        properties: [],
        clients: [],
        sales: [],
      };
    case USER_ROLE.Client:
      return {
        sales: [],
      };
    default:
      throw new Error("Role is not recognized");
  }
};
