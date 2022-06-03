import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { User } from '../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  users: User[] = [];
  user = new User();

  registerForm = new FormGroup(
    {
      username: new FormControl(''),
      password: new FormControl(''),
    });

  constructor(private router: Router, private appService: AppService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.appService.getUsers().subscribe((data)=> {
      this.users = data as User[];

      for(this.user of this.users) {
        if(this.user.name === this.registerForm.value.username){
          alert("User already registered!");
          return;
        }
      }

      if(!this.registerForm.valid){
        alert("helytelen");
      }else{
        var username = this.registerForm.value.username;
        var password = this.registerForm.value.password;
    
        this.user.name = username;
        this.user.password = password;
    
        this.appService.createrUser(this.user).subscribe(data => this.user);

        alert("Succesfully registered")
        this.router.navigateByUrl('/login');
      }
    })
  }

}
