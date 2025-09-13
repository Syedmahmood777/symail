import { Component,ElementRef, ViewChild, HostListener  } from '@angular/core';
import { FormGroup,FormControl,Validators,ReactiveFormsModule,AbstractControl, ValidationErrors} from '@angular/forms';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, map, max, startWith } from 'rxjs/operators';
import { rCountries } from '../../../../assets/countries';

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}
@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule,AsyncPipe],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})

export class Signup {
  @ViewChild('searchInput') searchInputRef!: ElementRef;
  @ViewChild('phoneInput') phoneInputRef!: ElementRef;

  currStep=2;

  form = new FormGroup({
    fName:new FormControl('',Validators.required),
    lName:new FormControl('',Validators.required),
    email: new FormControl('', [
  Validators.required,
  Validators.pattern(/^[a-zA-Z0-9._%+-]+@symail\.co$/)
]),
     pass: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{9,}$/)
    ]),
    rpass:new FormControl('',[Validators.required]),
     dob: new FormControl('dd/mm/yy', [Validators.required, this.dobValidator])

  },
  {validators:this.passwordValidator}

);
getFlagEmoji(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

countries: Country[] = rCountries.map(c => ({
  code: c.code,
  name: c.name,
  dialCode: c.dial_code,
  flag: this.getFlagEmoji(c.code)
})).sort((a, b) => a.name.localeCompare(b.name));



  selectedCountry=this.countries.find(c => c.code === 'IN')
  selectedCountry2=this.countries.find(c => c.code === 'IN')?.name;
  
form2 = new FormGroup({
    pNo:new FormControl('',Validators.required),
    phone: new FormControl('', [Validators.required, Validators.minLength(10),Validators.maxLength(10)]),
    country:new FormControl (this.selectedCountry),
    city:new FormControl('',Validators.required),
    address:new FormControl('',Validators.required),
  }
); 

 
  searchControl = new FormControl('');
  filteredCountries$!: Observable<Country[]>;
  isDropdownOpen = false;
  isDropdownOpen2 = false;

  ngOnInit() {
    this.filteredCountries$ = this.searchControl.valueChanges.pipe(
      startWith(''),                        // initial load
      debounceTime(200),                    // wait for typing to pause
      distinctUntilChanged(),
      map(term => (term || '').toLowerCase()),
      map(term =>
        this.countries.filter(c =>
          c.name.toLowerCase().includes(term) ||
          c.dialCode.includes(term) ||
          c.code.toLowerCase().includes(term)
        )
      )
    );
  }

  @ViewChild('dropdown') dropdownRef!: ElementRef;

@HostListener('document:click', ['$event'])
onClick(event: Event) {
  if (this.dropdownRef && !this.dropdownRef.nativeElement.contains(event.target)) {
    this.isDropdownOpen2=false;
  }
}

  selectCountry(country:Country){
    this.selectedCountry=country;
    this.isDropdownOpen=false;
  }
  selectCountry2(country:Country){
    this.selectedCountry2=country.name;
    this.toggleDropdown2();
  }

toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    
    if (this.isDropdownOpen) {
      setTimeout(() => {
        this.searchInputRef?.nativeElement?.focus();
      }, 0);     
    }
  }
toggleDropdown2() {
    this.isDropdownOpen2 = !this.isDropdownOpen2;
    
    if (this.isDropdownOpen2) {
      setTimeout(() => {
        this.searchInputRef?.nativeElement?.focus();
      }, 0);     
    }
  }




  

  private markAlltouched(){
    Object.values(this.form.controls).forEach(control=>{
      control.markAsTouched()
    })
  }

    onSubmit() {
    if (this.form.invalid) {
      this.markAlltouched();
      return;
    }

  }

  passwordValidator(group:AbstractControl): ValidationErrors | null {
    const pass = group.get('pass')?.value;
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

  nextStep(){
    if(this.currStep<3){
      this.currStep++;
    }
  }
  prevStep(){
    if(this.currStep>1){
      this.currStep--;
    }
  }
}
