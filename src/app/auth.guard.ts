import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginComponent } from '../app/login/login.component';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router, private logincomponent: LoginComponent) { }

  canActivate(): boolean {
    let token = localStorage.getItem('token')

    if (token) {
      return true;
    } else {
      this.router.navigateByUrl("/login");
      return false;
    }
  }
}

@Injectable()
export class IsSignedInGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      this.router.navigateByUrl('/home');
      return false;
    }
    return true;
  }
}
