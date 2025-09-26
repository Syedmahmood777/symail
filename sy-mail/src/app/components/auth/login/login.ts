import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  showError = false;
  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@symail\.co$/),
    ]),
    pass: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{9,}$/),
    ]),
  });
  private markAlltouched(form: FormGroup) {
    Object.values(form.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
  onSubmit() {
    if (this.form.invalid) {
      this.markAlltouched(this.form);
      return;
    } else {
    }
  }
}
