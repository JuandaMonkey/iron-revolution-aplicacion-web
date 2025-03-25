import { Clients } from "../clients/clients.model";
import { Branches } from "../branches/branches.model";

export interface ActivityCenter {
    cliente: Clients,
    entrada: string,
    salida: string,
    sucursal: Branches
}
