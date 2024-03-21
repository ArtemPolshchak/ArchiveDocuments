import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCard, MatCardContent, MatCardModule, MatCardTitle} from "@angular/material/card";
import {NgIf} from "@angular/common";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {LoginService} from "../../services/login.service";
import {Router} from "@angular/router";
import {CategoryService} from "../../services/category.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardTitle,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    NgIf,
    MatInput,
    MatButton,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
      FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup;
  error: string | null = null;

  @Output() loginSuccess = new EventEmitter();

  constructor(private fb: FormBuilder, private loginService: LoginService,
             private categoryService: CategoryService, private router: Router) {

    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.loginService.login(this.form.value).subscribe(
          () => {
            this.error = null;
            this.loginSuccess.emit();
            this.getCategories();
          },
          error => {
            this.error = error.message;
          }
      );
    }
  }


  private getCategories1(): void {
    this.categoryService.getAll()
        .subscribe( {
          next: (v) =>
              sessionStorage.setItem('categories', JSON.stringify(v.content)),
          error: (e) => console.error(e),
        });
  }

  private getCategories(): void {
    this.categoryService.getAllAndStoreInSessionStorage().subscribe(
        () => {
          // Операція завершена успішно
        },
        error => {
          console.error('Error getting categories:', error);
        }
    );
  }
  redirectToRegistration(): void {
    this.router.navigateByUrl("/registration");
  }
}

