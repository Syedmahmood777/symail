import {
  NgZone,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  HostListener,
  signal
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  max,
  startWith,
} from 'rxjs/operators';
import { rCountries } from '../../../../assets/countries';
import { User } from '../../../db_models/user';
import { AuthService } from '../../../services/auth-service';
import { RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}
@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink, MatProgressBarModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class Signup {
  @ViewChild('searchInput') searchInputRef!: ElementRef;
  @ViewChild('phoneInput') phoneInputRef!: ElementRef;
  constructor(
    private authServ: AuthService,
    private cd: ChangeDetectorRef,
    private _ngZone: NgZone,
  ) { }

  loading = signal(false);
  currStep = 1;

  form = new FormGroup(
    {
      fName: new FormControl<string>('', Validators.required),
      lName: new FormControl<string>('', Validators.required),
      email: new FormControl<string>('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@symail\.co$/),
      ]),
      password: new FormControl<string>('', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{9,}$/),
      ]),
      rpass: new FormControl<string>('', [Validators.required]),
      dob: new FormControl<string>('dd/mm/yy', [
        Validators.required,
        this.dobValidator,
      ]),
    },
    { validators: this.passwordValidator },
  );
  getFlagEmoji(countryCode: string): string {
    return countryCode
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(127397 + char.charCodeAt(0)),
      );
  }

  countries: Country[] = rCountries
    .map((c) => ({
      code: c.code,
      name: c.name,
      dialCode: c.dial_code,
      flag: this.getFlagEmoji(c.code),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  selectedCountry = this.countries.find((c) => c.code === 'IN');

  form2 = new FormGroup({
    phone: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
    ]),
    country: new FormControl<string>(this.selectedCountry?.name ?? ''),
    city: new FormControl<string>('', Validators.required),
    address: new FormControl<string>('', Validators.required),
    pin: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
    ]),
  });

  searchControl = new FormControl('');
  filteredCountries$!: Observable<Country[]>;
  isDropdownOpen = false;

  ngOnInit() {
    this.filteredCountries$ = this.searchControl.valueChanges.pipe(
      startWith(''), // initial load
      debounceTime(200), // wait for typing to pause
      distinctUntilChanged(),
      map((term) => (term || '').toLowerCase()),
      map((term) =>
        this.countries.filter((c) => c.name.toLowerCase().startsWith(term)),
      ),
    );
  }

  @ViewChild('dropdown') dropdownRef!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (
      this.dropdownRef &&
      !this.dropdownRef.nativeElement.contains(event.target)
    ) {
      this.isDropdownOpen = false;
    }
  }

  selectCountry(country: Country) {
    this.selectedCountry = country;
    this.isDropdownOpen = false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;

    if (this.isDropdownOpen) {
      setTimeout(() => {
        this.searchInputRef?.nativeElement?.focus();
      }, 0);
    }
  }

  private markAlltouched(form: FormGroup) {
    Object.values(form.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.markAlltouched(this.form);
      return;
    } else {

      this.loading.set(true);
      this.cd.detectChanges();

    try {
      const email = this.form.get("email")!.value ?? "";

      if (await this.validEmail(email)) {
        console.log("wp");
      } else {
        await this.nextStep();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.loading.set(false) ;
      this.cd.detectChanges();
    }

    }
  }
  async onSubmit2() {
    if (this.form2.invalid) {
      this.markAlltouched(this.form2);
    } else {
      const email = this.form.get('email')!.value ?? '';
      const password = this.form.get('password')!.value ?? '';
      const fname = this.form.get('fName')!.value ?? '';
      const lname = this.form.get('lName')!.value ?? '';
      const country = this.form2.get('country')!.value ?? '';
      const city = this.form2.get('city')!.value ?? '';
      const dialCode = this.selectedCountry?.dialCode.replace('+', '') ?? '91';
      const phone = Number(dialCode + this.form2.get('phone')?.value);
      const pin = this.form2.get('pin')!.value ?? '';
      const address = this.form2.get('address')!.value ?? '';
      const dob = this.form.get('dob')!.value ?? '';

      console.log(
        dob,
        email,
        password,
        fname,
        lname,
        country,
        city,
        phone,
        pin,
        address,
      );

      try {
        const res = await lastValueFrom(
          this.authServ.signup(
            fname,
            lname,
            country,
            city,
            phone,
            pin,
            address,
            email,
            password,
            dob,
          ),
        );

        console.log('Signup successful', res);
        this.nextStep();
        this.cd.detectChanges();
      } catch (err) {
        console.error('Signup failed', err);
      }
    }
  }

  async validEmail(email: string) {
    try {
      const res = await lastValueFrom(this.authServ.signVal(email));
      console.log(res);
      return res.exists;
    } catch (err) {
      return true;
    }
  }

  passwordValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const rpass = group.get('rpass')?.value;
    return pass === rpass ? null : { notMatched: true };
  }

  dobValidator(control: AbstractControl) {
    if (!control.value) return null;

    const inputDate = new Date(control.value);
    const today = new Date();

    // must be a valid date
    if (isNaN(inputDate.getTime())) {
      return { invalidDate: true };
    }

    // cannot be future date
    if (inputDate > today) {
      return { futureDate: true };
    }

    // must be at least 18 years old
    const ageDiff = today.getFullYear() - inputDate.getFullYear();
    const monthDiff = today.getMonth() - inputDate.getMonth();
    const dayDiff = today.getDate() - inputDate.getDate();

    let age = ageDiff;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    if (age < 18) {
      return { underage: true };
    }

    return null;
  }

  nextStep() {
    if (this.currStep < 3) {
      this.currStep++;
    }
  }
  prevStep() {
    if (this.currStep > 1) {
      this.currStep--;
    }
  }
}
