import { Branches } from "../branches/branches.model";

export interface Clients {
    nip: string
    foto: any
    clave_Seguridad: string
    nombre_Completo: string
    celular: string
    observacion: any
    membresia: string
    fecha_Inicio: string
    fecha_Fin: string
    sucursal: Branches
}
