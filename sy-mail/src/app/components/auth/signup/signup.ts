import { Component,ElementRef, ViewChild } from '@angular/core';
import { FormGroup,FormControl,Validators,ReactiveFormsModule,AbstractControl, ValidationErrors} from '@angular/forms';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';

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
// Country data
  countries: Country[] = [
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
    { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },
    { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
    { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65' },
    { code: 'AE', name: 'UAE', flag: '🇦🇪', dialCode: '+971' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20' },
    { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7' },
    { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48' },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46' },
    { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '+47' },
    { code: 'DK', name: 'Denmark', flag: '🇩🇰', dialCode: '+45' },
    { code: 'FI', name: 'Finland', flag: '🇫🇮', dialCode: '+358' },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41' },
    { code: 'AT', name: 'Austria', flag: '🇦🇹', dialCode: '+43' }
  ];
  selectedCountry=this.countries.find(c => c.code === 'IN')
  
form2 = new FormGroup({
    pNo:new FormControl('',Validators.required),
    phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
    country:new FormControl (this.countries.find(c => c.code === 'IN'))
  }
); 
 
  

 
  searchControl = new FormControl('');
  filteredCountries$!: Observable<Country[]>;
  isDropdownOpen = false;

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

  selectCountry(country:Country){
    
  }

toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    
    if (this.isDropdownOpen) {
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
