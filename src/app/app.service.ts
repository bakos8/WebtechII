import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { User } from './models/user';
import { Cars } from './models/cars';

@Injectable({
  providedIn: 'root'
})

export class AppService {

  serviceURL = 'http://localhost:4000';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  user = new User();
  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get(`${this.serviceURL}/users`);
  }

  getCars() {
    return this.http.get(`${this.serviceURL}/cars`);
  }

  createrUser(data: User): Observable<User> {
    return this.http.post<User>((`${this.serviceURL}/register`), data);
  }


  addCar(data: Cars){
    return this.http.post<Cars>((`${this.serviceURL}/addcar`), data)
  }

  deleteCar(id: any) {
    return this.http.delete(`${this.serviceURL}/cars/${id}`);
  }

}