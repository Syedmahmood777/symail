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
import { Router } from '@angular/router';
import { signal} from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {finalize} from 'rxjs/operators';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, MatProgressBarModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  constructor(private authServ: AuthService, private router: Router) {}
  loading=signal(false);
  showError = signal(false);
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

    this.loading.set(true);
    const email = this.form.get('email')!.value ?? '';
    const pass = this.form.get('pass')!.value ?? '';
    this.authServ.login(email, pass).pipe(
  finalize(() => this.loading.set(false))
).subscribe({
      next: (res) =>{
        this.router.navigate(['/'])
      },
      error: (err) => {

      this.showError.set(true);

      },
    });
    this.loading.set(false);
  }
}
