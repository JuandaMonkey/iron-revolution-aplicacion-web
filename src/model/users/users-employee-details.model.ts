// models
import { Users } from "./users.model";
import { Employees } from "../employees/employees.model";

export interface UsersEmployeeDetails {
    usuario: Users,
    empleado: Employees
}
