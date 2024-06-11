import { USER_ROLE } from "@/enums/user";
import { Profile } from "@/types/profile";

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

export const buildFullName = (profile: Profile) =>
  `${profile.firstName} ${profile.lastName}`;
