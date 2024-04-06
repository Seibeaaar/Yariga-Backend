import { USER_ROLE } from "@/enums/user";

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
