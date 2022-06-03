import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { format } from 'path';
import { AppService } from '../app.service';
import { Cars } from '../models/cars';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  cars: Cars[] = [];
  car = new Cars();
  closeResult = '';
  available: boolean = true

  //Form group for handling user inputs
  carRegisterForm = new FormGroup(
    {
      make: new FormControl('', Validators.required),
      model: new FormControl('', Validators.required),
      year: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
      color: new FormControl('', Validators.required),
      odometer: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
      price: new FormControl('', [Validators.required, Validators.pattern('[0-9.]*')])
    })

  get all() { return this.carRegisterForm.controls }

  constructor(private appService: AppService, private router: Router, private modalservice: NgbModal) { }

  ngOnInit(): void {
    this.getData();
  }

  //Retrieve data from database, and display it
  getData() {
    this.appService.getCars().subscribe((data) => {
      this.cars = data as Cars[];
    })
  }

  //Delete the selected record
  deleteData(id: any) {
    this.appService.deleteCar(id).subscribe(() => {
      this.getData();
    })
  }

  //Sign out of the application
  singOut() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login')
  }

  //Adding a new record - cheks for empty fields, or already registered cars
  onSave() {
    this.available = true;
    if (this.carRegisterForm.value.make == '' || this.carRegisterForm.value.model == '' || this.carRegisterForm.value.year == '' ||
      this.carRegisterForm.value.color == '' || this.carRegisterForm.value.odometer == '' || this.carRegisterForm.value.price == '') {
      alert('Fill all fields!');
      this.available = false;
    }

    for (let car of this.cars) {
      if (car.make === this.carRegisterForm.value.make && car.model === this.carRegisterForm.value.model && car.year === this.carRegisterForm.value.year
        && car.color === this.carRegisterForm.value.color && car.odometer === this.carRegisterForm.value.odometer
        && car.price === this.carRegisterForm.value.price) {
        alert("This car is already registered!");
        this.available = false;
      }
    }

    if(this.available == true){
      this.car.make = this.carRegisterForm.value.make,
      this.car.model = this.carRegisterForm.value.model,
      this.car.year = this.carRegisterForm.value.year,
      this.car.color = this.carRegisterForm.value.color,
      this.car.odometer = this.carRegisterForm.value.odometer,
      this.car.price = this.carRegisterForm.value.price

      this.carRegisterForm.reset();

     this.appService.addCar(this.car).subscribe(() => { this.getData(); });
    }
  }

  //Floating modal window for adding new records
  open(content: any) {
    this.modalservice.open(content,
      { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult =
          `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
