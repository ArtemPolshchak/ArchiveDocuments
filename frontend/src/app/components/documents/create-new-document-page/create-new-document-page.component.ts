import { Component, OnDestroy, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Validators, Editor, Toolbar, NgxEditorModule} from "ngx-editor";
import jsonDoc from '../../../templates/doc';
import {MatError, MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {DocumentService} from "../../../services/document.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CreateDocument} from "../../../common/create-document";
import {MatAutocomplete, MatAutocompleteModule, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {map, Observable, of, startWith} from "rxjs";

import {Category} from "../../../common/category";
@Component({
  selector: 'app-create-new-document-page',
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
  templateUrl: './create-new-document-page.component.html',
  styleUrl: './create-new-document-page.component.scss'
})
export class CreateNewDocumentPageComponent implements OnInit, OnDestroy {
  editordoc = jsonDoc;
  editor: Editor;
  documentName: string = '';
  createDocument: CreateDocument = { title: '', textContent: '', categoryId: 0 };
  myControl = new FormControl('');

  options: Category[] = [];
  filteredOptions: Observable<Category[]> = of([]);
  selectedOption: Category | undefined;

  constructor(
      private documentService: DocumentService,
      private router: Router,
      private _snackBar: MatSnackBar,
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

  form = new FormGroup({
    editorContent: new FormControl(
        { value: jsonDoc, disabled: false },
        Validators.required()
    ),
  });

  get doc(): AbstractControl | null {
    return this.form.get('editorContent');
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
    );
    this.loadCategories();

  }

  private _filter(value: string): Category[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  trackByFn(index: number, item: any): any {
    return item.id;
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  saveDocument(categoryId: number): void {
    if (this.form.valid && this.documentName.trim() !== '' && this.selectedOption) {
      const createUpdateDto: CreateDocument = {
        title: this.documentName.trim(),
        textContent: JSON.stringify(this.form.controls['editorContent'].value),
        categoryId: categoryId
      };

      this.documentService.createDocument(createUpdateDto).subscribe(
          () => {
            this.openSnackBar('Документ успішно створено.');
            this.router.navigateByUrl('/documents');
          },
          (error) => {
            console.error('Помилка під час створення документа:', error);
          }
      );
    }
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message, 'Закрити', {
      duration: 5000,
    });
  }

  loadCategories(): void {
    const storedCategories = sessionStorage.getItem('categories');
    if (storedCategories) {
      let categories: Category[] = JSON.parse(storedCategories);
      categories.sort((a: Category, b: Category) => a.name.localeCompare(b.name)); // Сортуємо категорії за назвою
      this.options = categories;
      console.log("Loaded categories from SessionStorage and sorted alphabetically.");
    }
  }
}
