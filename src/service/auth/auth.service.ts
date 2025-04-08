import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// service api
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

// models
import { UsersSession } from '../../model/users/users-session.model'; 
import { UsersLogin } from '../../model/users/users-login.model';
import { UsersToken } from '../../model/users/users-token.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // url
  private url = 'https://localhost:44363/api';

  // token and session iformation
  private readonly TOKEN_KEY = 'token';

  private currentUser = new BehaviorSubject<UsersSession | null>(null);
  public currentUser$ = this.currentUser.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router 
  ) { this.initializeSession(); }

  login(user: UsersLogin): Observable<UsersToken> {
    return this.http.post<UsersToken>(`${this.url}/auth/login`, user).pipe(
      tap((tokenData: UsersToken) => {
        localStorage.setItem(this.TOKEN_KEY, tokenData.token);
        this.saveInformationToken(tokenData.token);
      })
    );
  }

  private initializeSession() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token && this.isTokenValid(token)) {
      this.saveInformationToken(token);
    } else {
      this.clearData();
    }
  }

  private saveInformationToken(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userData: UsersSession = {
        nombre_Usuario: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        rol: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        nip: payload['NIP'],
        exp: payload['exp']
      };
      
      this.currentUser.next(userData);
    } catch (error) {
      console.error('Error al decodificar token:', error);
      this.clearData();
    }
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  public getCurrentUser(): UsersSession | null {
    return this.currentUser.value;
  }

  public hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.rol === role;
  }

  logout() {
    this.clearData();

    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  private clearData() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.next(null);
  }
}
