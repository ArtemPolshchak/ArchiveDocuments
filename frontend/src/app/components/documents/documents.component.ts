import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {NgForOf, NgIf} from "@angular/common";
import {Category} from "../../common/category";
import {Document} from "../../common/document";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DocumentService, GetDocumentResponse} from "../../services/document.service";
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-documents',
    standalone: true,
    imports: [
        FormsModule,
        MatInput,
        MatPaginator,
        NgForOf,
        NgIf
    ],
    templateUrl: './documents.component.html',
    styleUrl: './documents.component.scss'
})
export class DocumentsComponent {
    categories: Category[] = [];
    documents: Document[] = [];
    titlesAndCategories: string[] = [];

    pageNumber: number = 0;
    pageSize: number = 10;
    totalElements: number = 0;
    name: string = '';
    sortState?: string = 'title,asc';
    selectedItem: Category | undefined;
    durationInSeconds: number = 5;
    titles: string[] = [];
    categoryName: string = '';
    isAdmin: boolean = false;
    isModerator: boolean = false;

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    toppings = this._formBuilder.group({
        pepperoni: false,
        extracheese: false,
        mushroom: false,
    });

    constructor(
        private documentService: DocumentService,
        private _formBuilder: FormBuilder,
        private router: Router,
        private _snackBar: MatSnackBar,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService
    ) {
    }

    ngOnInit(): void {
        this.isAdmin = this.authService.isAdmin();
        this.isModerator = this.authService.isModerator();
        this.activatedRoute.queryParams.subscribe(params => {
            this.categoryName = params['category'];
            if (this.categoryName) {
                this.loadDocumentsByCategory();
            } else {
                this.getDocumentsPages();
            }
        });

    }

    goToUpdateDocumentPage(document: Document): void {
        if (document && document.id) {
            this.router.navigate(['/update-document', document.id]);
        }
    }

    goToCreateNewDocumentPage(): void {
        this.router.navigate(['/create-new-document']);
    }

    deleteDocument(document: Document): void {
        if (document && document.id) {
            this.documentService.deleteDocument(document.id).subscribe(
                () => {
                    this.openSnackBar('The document was successfully deleted.');
                    this.getDocumentsPages();
                },
                (error) => {
                    console.error('Error deleting document:', error);
                }
            );
        }
    }

    onPageChange(event: PageEvent): void {
        this.pageNumber = event.pageIndex;
        this.pageSize = event.pageSize;
        if (this.categoryName) {
            this.loadDocumentsByCategory();
        } else {
            this.getDocumentsPages();
        }
    }

    applySearch(): void {
        if (this.name && this.name.trim() !== '') {
            this.searchDocuments();
        } else {
            this.getDocumentsPages();
        }
    }

    sorting(): void {
            this.getDocumentsPages();

    }

    searchDocuments(): void {
        if (this.name && this.name.trim() !== '') {
            if (!this.titlesAndCategories) {
                this.titlesAndCategories = [];
            }
            this.titlesAndCategories.push(this.name.trim());
        }

        this.documentService.getAllDocumentsWithSearch1(this.titlesAndCategories, this.pageNumber, this.pageSize, this.sortState)
            .subscribe((response) => {
                this.documents = response.content.map((doc: any) => {
                    return {
                        id: doc.id,
                        title: doc.title,
                        textContent: doc.textContent,
                        category: doc.category,
                        dateCreated: doc.dateCreated
                    };
                });
                this.totalElements = response.totalElements;
            });
    }

    loadDocumentsByCategory(): void {
        this.documentService.getAllByCategoryName(this.categoryName, this.pageNumber, this.pageSize)
            .subscribe((response: GetDocumentResponse) => {
                this.documents = response.content;
                this.totalElements = response.totalElements;
            });
    }

    getDocumentsPages(): void {
        this.documentService.getAllDocuments(this.pageNumber, this.pageSize, this.sortState)
            .subscribe((response) => {
                this.documents = response.content;
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