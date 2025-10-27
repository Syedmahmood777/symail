import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthService } from '../../../services/auth-service';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(private authServ: AuthService) { }

  showError = false;
  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@symail\.co$/),
    ]),
    pass: new FormControl('', [Validators.required]),
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
    }
    const email = this.form.get('email')!.value ?? '';
    const pass = this.form.get('pass')!.value ?? '';
    this.authServ.login(email, pass).subscribe({
      next: (res) => console.log('Login successfl', res),
      error: (err) => console.error('Login didnt hhaappe', err),
    });
  }
}
