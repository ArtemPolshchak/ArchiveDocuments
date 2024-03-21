import {Component, OnInit, ViewChild} from '@angular/core';
import {CurrencyPipe, DatePipe, JsonPipe, NgForOf, NgIf} from "@angular/common";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {
    NgbAccordionBody,
    NgbAccordionButton,
    NgbAccordionCollapse,
    NgbAccordionDirective, NgbAccordionHeader, NgbAccordionItem
} from "@ng-bootstrap/ng-bootstrap";
import {MatCheckbox, MatCheckboxModule} from "@angular/material/checkbox";
import {MatDialog} from "@angular/material/dialog";
import {Category} from "../../common/category";
import {CategoryService} from "../../services/category.service";
import {Router} from "@angular/router";
import {UpdateCategoryComponent} from "./update-category-dialog/update-category.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CreateNewCategoryDialogComponent} from "./create-new-category-dialog/create-new-category-dialog.component";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-category',
  standalone: true,
    imports: [
        CurrencyPipe,
        DatePipe,
        NgForOf,
        NgbAccordionBody,
        NgbAccordionButton,
        NgbAccordionCollapse,
        NgbAccordionDirective,
        NgbAccordionHeader,
        NgbAccordionItem,
        MatPaginator,
        MatCheckbox,
        FormsModule, ReactiveFormsModule, MatCheckboxModule, JsonPipe, MatInput, NgIf

    ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
    categories: Category[] = [];
    totalElements: number = 0;
    pageNumber: number = 0;
    pageSize: number = 10;
    name?: string;
    sortState?: string = 'name,asc';
    selectedItem: Category | undefined;
    durationInSeconds: number = 5;
    isAdmin: boolean = false;
    isModerator: boolean = false;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    toppings = this._formBuilder.group({
        pepperoni: false,
        extracheese: false,
        mushroom: false,
    });

    constructor(
        private categoryService: CategoryService,
        private dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private router: Router,
        private _snackBar: MatSnackBar,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.isAdmin = this.authService.isAdmin();
        this.isModerator = this.authService.isModerator();
        this.getCategoriesPage();
    }

    getCategoriesPage(): void {
        this.categoryService.getAllCategoriesPaginated(this.pageNumber, this.pageSize, this.sortState)
            .subscribe((response) => {
                this.categories = response.content;
                this.totalElements = response.totalElements;
            });
    }


    goToDocumentsOfCurrentCategory(categoryName: string): void {
        this.router.navigate(['/documents'], { queryParams: { category: categoryName } });
    }

    deleteCategory(category: Category): void {
        if (category && category.id) {
            this.categoryService.deleteCategory(category.id).subscribe(
                () => {
                    this.openSnackBar('Категорія успішно видалена.');

                    // Видалити категорію зі списку категорій у SessionStorage
                    const categoriesFromStorage = JSON.parse(sessionStorage.getItem('categories') || '[]');
                    const updatedCategories = categoriesFromStorage.filter((cat: Category) => cat.id !== category.id);
                    sessionStorage.setItem('categories', JSON.stringify(updatedCategories));

                    // Після успішного видалення оновіть список категорій
                    this.getCategoriesPage();
                },
                (error) => {
                    console.error('Помилка під час видалення категорії:', error);
                }
            );
        }
    }


    editCategory(category: Category): void {
        const dialogRef = this.dialog.open(UpdateCategoryComponent, {
            width: '50%',
            data: { category: category, id: category.id }
        });
    }

    openAddCategoryDialog(): void {
        const dialogRef = this.dialog.open(CreateNewCategoryDialogComponent, {
            width: '50%',
            data: { category: {}, id: undefined } // передача порожньої категорії та undefined ідентифікатора
        });

        dialogRef.afterClosed().subscribe(result => {
            // Виконати дії після закриття діалогового вікна, якщо потрібно
        });
    }


    onPageChange(event: PageEvent): void {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        this.getCategoriesPage();
    }

    applySearch(): void {
        if (this.name && this.name.trim() !== '') {
            this.search();
        } else {
            this.getCategoriesPage();
        }
    }

    search(): void {
        this.categoryService.search(this.name, this.pageNumber, this.pageSize, this.sortState)
            .subscribe((response) => {
                this.categories = response.content;
                this.totalElements = response.totalElements;
            });
    }

    handleClick($event: any): void {
        $event.stopPropagation();
    }

    select(category: Category): void {
        this.selectedItem = category;
    }

    openSnackBar(message: string) {
        this._snackBar.open(message, 'Закрити', {
            duration: this.durationInSeconds * 1000,
        });
    }

}
