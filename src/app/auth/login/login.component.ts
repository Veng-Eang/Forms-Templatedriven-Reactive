import { Component, DestroyRef, inject, OnInit} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, of } from 'rxjs';

function mustIncludeQestionMark(control : AbstractControl){
  if(control.value.includes('?')){
    return null;
  }
  return { noIncludeQeutionMark : true}
}

function uniqEmail(control : AbstractControl){
  if(control.value !== 'oengvengeang@gmail.com'){
    return of(null);
  }
  return of({ error: true})
}

let initailValue = '';
const savedForm = window.localStorage.getItem('saved-login-form');

if(savedForm){
    const loadData = JSON.parse(savedForm);
    initailValue = loadData.email;
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule]
})
export class LoginComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  form = new FormGroup({
    email: new FormControl(initailValue,{
      validators: [
        Validators.required,
        Validators.email,
      ],
      asyncValidators: [
        uniqEmail
      ]
    }),
    password: new FormControl('',{
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustIncludeQestionMark,
      ]
    })
  })

  get isEmailInvalid(){
    return (this.form.controls.email.invalid && this.form.controls.email.dirty && this.form.controls.email.touched);
  }

  get isPasswordInvalid(){
    return (this.form.controls.password.invalid && this.form.controls.password.dirty && this.form.controls.password.touched);
  }

  ngOnInit(): void {

    const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({
      next: value=>window.localStorage.setItem('saved-login-form',JSON.stringify({'email':value.email}))
    });

    this.destroyRef.onDestroy(()=>{
      subscription.unsubscribe();
    });

  }

  onSubmit(){
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
    console.log(enteredEmail,enteredPassword);
    // this.form.reset();
  }
}
