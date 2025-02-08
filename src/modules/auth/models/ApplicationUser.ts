import { Roles } from "../enums/Roles";
import UserGuild from "./UserGuild";

export type ApplicationUser = {
    id: string,
    username?: string,
    chamoyRole: Roles,
    guilds?: UserGuild[]
};