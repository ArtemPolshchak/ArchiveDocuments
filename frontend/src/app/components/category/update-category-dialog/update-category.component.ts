import {Component, Inject, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent} from "@angular/material/card";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogRef
} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {Category} from "../../../common/category";
import {CategoryService} from "../../../services/category.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-update-category',
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
  templateUrl: './update-category.component.html',
  styleUrl: './update-category.component.scss'
})
export class UpdateCategoryComponent implements OnInit {
    categoryControl = new FormControl('', [Validators.required]);
    categoryId: number | undefined;
    durationInSeconds: number = 5;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { category: Category, id: number },
        private dialogRef: MatDialogRef<UpdateCategoryComponent>,
        private categoryService: CategoryService,
        private router: Router,
        private _snackBar: MatSnackBar
    ) {
        this.categoryId = data.id;
    }

    ngOnInit(): void {}

    updateCategory(): void {
        if (this.categoryControl.valid && this.categoryControl.value !== null && this.categoryId !== undefined) {
            const updatedCategory: Category = {
                id: this.categoryId,
                name: this.categoryControl.value
            };
            const categoriesFromStorage = JSON.parse(sessionStorage.getItem('categories') || '[]');

            const updatedCategories = categoriesFromStorage.map((category: Category) => {
                if (category.id === this.categoryId) {
                    return updatedCategory;
                }
                return category;
            });

            sessionStorage.setItem('categories', JSON.stringify(updatedCategories));

            this.categoryService.updateCategory(this.categoryId, updatedCategory).subscribe(
                () => {
                    this.dialogRef.close(true);
                    this.openSnackBar('Category successfully updated.');
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                        this.router.navigate(['category']);
                    });
                },
                (error) => {
                    console.error('Error updating category:', error);
                }
            );
        }
    }

    openSnackBar(message: string) {
        this._snackBar.open(message, 'close', {
            duration: this.durationInSeconds * 1000,
        });
    }
}

