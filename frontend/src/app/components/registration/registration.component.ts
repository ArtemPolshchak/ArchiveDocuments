import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardModule, MatCardTitle} from "@angular/material/card";
import {MatInput, MatInputModule} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {RegistrationService} from "../../services/registration.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
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
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
    form: FormGroup;
    error: string | null = null;

    @Output() registrationSuccess = new EventEmitter();

    constructor(private fb: FormBuilder,
                private registration: RegistrationService, private router: Router) {

        this.form = this.fb.group({
            username: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    submit(): void {
        if (this.form.valid) {
            this.registration.registration(this.form.value).subscribe(
                () => {
                    this.error = null;
                    this.registrationSuccess.emit();

                },
                error => {
                    this.error = error.message;
                }
            );
        }
    }

    redirectToLogin(): void {
        this.router.navigateByUrl("/documents");
    }

}
