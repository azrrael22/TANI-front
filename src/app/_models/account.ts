export class Account {
    id?: string;
    nombre?: string;
    fechaNacimiento?: string;
    telefono?: string;
    correo?: string;
    contrasenia?: string;
    tipoUsuario?: 'USUARIO' | 'ADMINISTRADOR'; // acepta ambos valores
    role?: string;
    jwtToken?: string;
}