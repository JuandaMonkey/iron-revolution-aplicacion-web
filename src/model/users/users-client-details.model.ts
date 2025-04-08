// models
import { Users } from "./users.model";
import { Clients } from "../clients/clients.model";

export interface UsersClientDetails {
    usuario: Users,
    cliente: Clients
}
