import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  users: User[] = [];

  loginForm = new FormGroup(
    {
      username: new FormControl(''),
      password: new FormControl(''),
    });

  constructor(private appService: AppService, private router: Router) { }

  ngOnInit(): void {
  }

  //Attempting to log in calls this function - this checks for registered users
  onSubmit() {
    this.appService.getUsers().subscribe((data) => {
    this.users = data as User[];

      for (let user of this.users) {
        if (user.name === this.loginForm.value.username && user.password === this.loginForm.value.password ) {
          localStorage.setItem('token', user.name);
          this.router.navigateByUrl('/home');
        } else{
          alert("Invalid credentials")
        }
      }
    });
  }
}
