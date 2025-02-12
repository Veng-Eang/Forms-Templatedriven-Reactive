import { afterNextRender, Component, DestroyRef, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [FormsModule]
})
export class LoginComponent {
  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);



  constructor(){
    const saveForm = window.localStorage.getItem('saved-login-form');

    if(saveForm){
      const loadedFormData = JSON.parse(saveForm);
      const savedEmail = loadedFormData.email;

      setTimeout(()=>{
        this.form().controls['email'].setValue(savedEmail);
      },1);
    }

    afterNextRender(()=>{
      const subscription = this.form().valueChanges?.pipe(debounceTime(500)).subscribe({
        next: value=>window.localStorage.setItem('saved-login-form',JSON.stringify({'email':value.email}))
      });

      this.destroyRef.onDestroy(()=>{
        subscription?.unsubscribe();
      });
    })
  }
  onSubmit(formData:NgForm){
    if(formData.form.invalid){
      return;
    }
    console.log(formData.form);
    const email = formData.form.value.email;
    const password = formData.form.value.password;
    console.log(email);
    console.log(password);
    formData.form.reset();
  }
}
