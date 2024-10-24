const allRoles = {
  customer: [],
  superAdmin: [],
  admin: ["getUsers", "manageUsers"],
  seller: [],
  moderator: [],
  deliveryMan: [],
};

export default class Role {
  static all = Object.keys(allRoles);

  static onlyAdmins = ["superAdmin", "admin"];
}

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
