import { Roles } from "../enums/Roles";

export type ApplicationUser = {
    id: string,
    username?: string,
    chamoyRole: Roles
};