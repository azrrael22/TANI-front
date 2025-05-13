import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Account } from '@app/_models';

const baseUrl = `${environment.apiUrl}/api/auth`;

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account | null>;
    public account: Observable<Account | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.accountSubject = new BehaviorSubject<Account | null>(null);
        this.account = this.accountSubject.asObservable();
    }

    public get accountValue() {
        return this.accountSubject.value;
    }

    /**
     * login(email: string, password: string) {
        return this.http.post<any>(`${baseUrl}/iniciar-sesion`, { email, password })
            .pipe(map(tokenDTO => {
                const account = { jwtToken: tokenDTO.jwt }; // Adaptar si es necesario
                this.accountSubject.next(account);
                this.startRefreshTokenTimer();
                this.router.navigate(['/home']);
                return account;
            }));
    }
     */

        login(email: string, password: string) {
        return this.http.post<any>(`${baseUrl}/iniciar-sesion`, { email, password })
            .pipe(map((usuario: any) => {
                // Transformar los datos recibidos en una instancia de Account
                const account: Account = {
                    id: usuario.idUsuario.toString(), // Convertir a string si es necesario
                    nombre: usuario.nombre,
                    fechaNacimiento: usuario.fechaNacimiento,
                    telefono: usuario.telefono,
                    correo: usuario.correo,
                    tipoUsuario: usuario.tipoUsuario, // 'USUARIO' o 'ADMINISTRADOR'
                };
    
                // Guardar la instancia transformada en el BehaviorSubject
                this.accountSubject.next(account);
    
                // Redirigir según el tipo de usuario
                if (account.tipoUsuario === 'ADMINISTRADOR') {
                    this.router.navigate(['/home']);
                } else {
                    this.router.navigate(['/home']);
                }
    
                return account;
            }));
    }
    
    /**
     * refreshToken() {
        return this.http.post<any>(`${baseUrl}/refresh-token`, {}, { withCredentials: true })
            .pipe(map((account) => {
                this.accountSubject.next(account);
                this.startRefreshTokenTimer();
                return account;
            }));
    }
     */
    

    logout() {
        // Limpiar el estado del usuario
        this.accountSubject.next(null);
    
        // Redirigir al usuario a la página de inicio de sesión
        this.router.navigate(['/account/login']);
    }

        register(account: Account) {
        account.tipoUsuario = 'USUARIO'; // Asegurar que siempre sea 'USUARIO'
        return this.http.post(`${baseUrl}/crear-cuenta`, account);
    }

    verifyEmail(token: string) {
        return this.http.post(`${baseUrl}/verify-email`, { token });
    }

    forgotPassword(email: string) {
        return this.http.post(`${baseUrl}/recuperar-contrasenia`, { correo: email });
    }

    validateResetToken(token: string) {
        return this.http.post(`${baseUrl}/validate-reset-token`, { token });
    }

    resetPassword(token: string, password: string) {
        return this.http.put(`${baseUrl}/restablecer-contrasenia?token=${token}`, { contrasenia: password });
    }    

    getAll() {
        return this.http.get<Account[]>(baseUrl);
    }

    getById(id: string) {
        return this.http.get<Account>(`${baseUrl}/${id}`);
    }

    create(params: any) {
        return this.http.post(baseUrl, params);
    }

    update(id: string, params: any) {
        return this.http.put(`${baseUrl}/${id}`, params)
            .pipe(map((account: any) => {
                // update the current account if it was updated
                if (account.id === this.accountValue?.id) {
                    // publish updated account to subscribers
                    account = { ...this.accountValue, ...account };
                    this.accountSubject.next(account);
                }
                return account;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`)
            .pipe(finalize(() => {
                // auto logout if the logged in account was deleted
                if (id === this.accountValue?.id)
                    this.logout();
            }));
    }

    // helper methods

    private refreshTokenTimeout?: any;

    private startRefreshTokenTimer() {
        //Metodo prueba Tokens
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}