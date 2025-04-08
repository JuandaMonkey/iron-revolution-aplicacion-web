// models
import { Branches } from "../branches/branches.model";

export interface Employees {
    nip: string
    foto: any
    nombre_Completo: string
    celular: string
    sucursal: Branches
}
