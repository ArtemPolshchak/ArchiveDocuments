import {Component} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef
} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

import {CategoryService} from "../../../services/category.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CreateCategory} from "../../../common/create-category";

@Component({
  selector: 'app-create-new-category-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './create-new-category-dialog.component.html',
  styleUrl: './create-new-category-dialog.component.scss'
})
export class CreateNewCategoryDialogComponent {
  categoryForm: FormGroup;

  constructor(
      private dialogRef: MatDialogRef<CreateNewCategoryDialogComponent>,
      private categoryService: CategoryService,
      private router: Router,
      private _snackBar: MatSnackBar,
      private formBuilder: FormBuilder
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  createCategory(): void {
    if (this.categoryForm.valid) {
      const categoryDto: CreateCategory = {
        name: this.categoryForm.value.name
      };
      this.categoryService.createCategory(categoryDto).subscribe(
          (createdCategory) => {
            const existingCategories = JSON.parse(sessionStorage.getItem('categories') || '[]');
            existingCategories.push(createdCategory);
            sessionStorage.setItem('categories', JSON.stringify(existingCategories));
            this.dialogRef.close(true);
            this.openSnackBar('Category successfully added.');
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['category']);
            });
          },
          (error) => {
            console.error('Error adding category', error);
          }
      );
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'close', {
      duration: 5000,
    });
  }
}
