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
    case USER_ROLE.Agent:
      return {
        properties: [],
        clients: [],
        sales: [],
      };
    case USER_ROLE.Manager:
      return {
        properties: [],
        agents: [],
      };
    case USER_ROLE.Customer:
      return {
        sales: [],
      };
    default:
      throw new Error("Role is not recognized");
  }
};
