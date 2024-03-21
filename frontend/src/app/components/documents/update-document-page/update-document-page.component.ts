import {Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import { FormBuilder, FormControl,  FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    MatAutocomplete,
    MatAutocompleteModule,
    MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import {MatError, MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {Editor, NgxEditorModule, Toolbar, Validators} from "ngx-editor";
import {CreateDocument} from "../../../common/create-document";
import {Category} from "../../../common/category";
import {map, Observable, of, startWith} from "rxjs";
import {DocumentService} from "../../../services/document.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-update-document-page',
  standalone: true,
    imports: [
        ReactiveFormsModule,
        NgxEditorModule,
        FormsModule,
        MatError,
        MatFormField,
        MatInput,
        MatLabel,
        NgIf,
        MatAutocompleteTrigger,
        MatAutocomplete,

        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        AsyncPipe,
        NgForOf,
    ],
  templateUrl: './update-document-page.component.html',
  styleUrl: './update-document-page.component.scss'
})
export class UpdateDocumentPageComponent implements OnInit, OnDestroy {
    editor: Editor;
    documentName: string = '';
    createDocument: CreateDocument = { title: '', textContent: '', categoryId: 0 };
    myControl = new FormControl('');
    categories: Category[] = [];
    filteredOptions: Observable<Category[]> = of([]);
    selectedCategory?: Category;
    documentId!: number;
    jsonDoc: string = '';
    isAdmin: boolean = false;
    isModerator: boolean = false;

    constructor(
        private documentService: DocumentService,
        private router: Router,
        private _snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private authService: AuthService
    ) {
        this.editor = new Editor();
    }

    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['link', 'image'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

    form = this.formBuilder.group({
        editorContent: ['', Validators.required],
    });

    ngOnInit(): void {
        this.isAdmin = this.authService.isAdmin();
        this.isModerator = this.authService.isModerator();
        this.route.params.subscribe(params => {
            this.documentId = params['id'];
            if (this.documentId) {
                this.loadDocumentData(this.documentId);
            }
        });

        this.editor = new Editor();
        this.loadCategories();
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
        );
    }

    ngOnDestroy(): void {
        this.editor.destroy();
    }

    loadDocumentData(documentId: number): void {
        this.documentService.getById(documentId).subscribe(
            (document) => {
                this.documentName = document.title;
                this.jsonDoc = document.textContent;
                this.selectedCategory = document.category

                try {
                    const parsedDoc = JSON.parse(this.jsonDoc);
                    this.form.controls['editorContent'].setValue(parsedDoc);
                } catch (error) {
                    console.error('Error while parsing the document:', error);
                }

                this.selectedCategory = this.categories.find(option => option.id === document.category.id);
            },
            (error) => {
                console.error('Error loading document:', error);
            }
        );
    }

    updateDocument(categoryId: number): void {
        if (this.form.valid && this.documentName.trim() !== '' && this.selectedCategory) {

            const createUpdateDto: CreateDocument = {
                title: this.documentName.trim(),
                textContent: JSON.stringify(this.form.controls['editorContent'].value),
                categoryId: categoryId
            };
            console.log("id: " + this.documentId);
            console.log("createUpdateDto: " + createUpdateDto.title);
            console.log("createUpdateDtoCategoryId: " + createUpdateDto.categoryId);
            this.documentService.updateDocument(this.documentId, createUpdateDto).subscribe(

                () => {
                    this.openSnackBar('The document has been updated successfully');
                    this.router.navigateByUrl('/documents');
                },
                (error) => {
                    console.error('Error updating document:', error);
                }
            );
        }
    }

    openSnackBar(message: string): void {
        this._snackBar.open(message, 'close', {
            duration: 5000,
        });
    }

    loadCategories(): void {
        const storedCategories = sessionStorage.getItem('categories');
        if (storedCategories) {
            let categories: Category[] = JSON.parse(storedCategories);
            categories.sort((a: Category, b: Category) => a.name.localeCompare(b.name));
            this.categories = categories;
            console.log("Loaded categories from SessionStorage and sorted alphabetically.");
        }
    }

    private _filter(value: string): Category[] {
        const filterValue = value.toLowerCase();
        return this.categories.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    trackByFn(index: number, item: any): any {
        return item.id;
    }
}

