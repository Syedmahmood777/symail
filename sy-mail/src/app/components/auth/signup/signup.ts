import { Component } from '@angular/core';
import { FormGroup,FormControl,Validators,ReactiveFormsModule,AbstractControl, ValidationErrors} from '@angular/forms';


@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})

export class Signup {
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

  form2 = new FormGroup({
    pNo:new FormControl('',Validators.required),
  }

); 

  

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
