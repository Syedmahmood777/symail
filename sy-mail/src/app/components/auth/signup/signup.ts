import { Component } from '@angular/core';
import { FormGroup,FormControl,Validators,ReactiveFormsModule,FormControlName} from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})

export class Signup {
  form = new FormGroup({
    firstn:new FormControl('',Validators.required),
    lastn:new FormControl('',Validators.required),
    email: new FormControl('', Validators.email),
    password: new FormControl('', Validators.minLength(6))

  });
}
