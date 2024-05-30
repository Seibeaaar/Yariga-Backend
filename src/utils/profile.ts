import { USER_ROLE } from "@/enums/user";

export const generateRoleBasedFields = (role: USER_ROLE) => {
  switch (role) {
    case USER_ROLE.Landlord:
      return {
        properties: [],
        clients: [],
        sales: [],
      };
    case USER_ROLE.Tenant:
      return {
        sales: [],
      };
    default:
      throw new Error("Role is not recognized");
  }
};
