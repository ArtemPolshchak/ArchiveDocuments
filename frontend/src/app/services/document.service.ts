import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Document} from "../common/document";
import {CreateDocument} from "../common/create-document";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private readonly baseUrl: string = '/api/documents';

  constructor(private httpClient: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllDocuments(pageNumber?: number, pageSize?: number, sort?: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/?page=${pageNumber}&size=${pageSize}&sort=${sort}`, { headers: this.getHeaders() });
  }

  public getAllDocumentsWithSearch1(titlesAndCategories?: string[], pageNumber?: number, pageSize?: number, sort?: string) {
    let params = new HttpParams();

    params = (titlesAndCategories && titlesAndCategories.length > 0) ? params.set('titlesAndCategories', titlesAndCategories.join(',')) : params;
    params = (pageNumber) ? params.set('page', pageNumber.toString()) : params;
    params = (pageSize) ? params.set('size', pageSize.toString()) : params;
    params = (sort) ? params.set('sort', sort) : params;


    const url: string = 'api/documents/search';

    return this.httpClient.get<GetDocumentResponse>(url, { params: params, headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')} }).pipe(
        map(response => response)
    );
  }

  getAllDocumentsWithSearch(specDto: DocumentSpecDto, pageNumber?: number, pageSize?: number, sort?: string): Observable<GetDocumentResponse> {
    let params = new HttpParams();

    params = (specDto.titles && specDto.titles.length > 0) ? params.set('titles', specDto.titles.join(',')) : params;
    params = (specDto.categories && specDto.categories.length > 0) ? params.set('categories', specDto.categories.join(',')) : params;
    params = (pageNumber) ? params.set('page', pageNumber.toString()) : params;
    params = (pageSize) ? params.set('size', pageSize.toString()) : params;
    params = (sort) ? params.set('sort', sort) : params;

    const url: string = 'api/documents/search';

    return this.httpClient.get<GetDocumentResponse>(url, { params: params, headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')} });
  }

  createDocument(createUpdateDto: CreateDocument): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}`, createUpdateDto, { headers: this.getHeaders() });
  }

  updateDocument(id: number, createUpdateDto: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/update/${id}`, createUpdateDto, { headers: this.getHeaders() });
  }

  deleteDocument(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  public getById(id: number) {
    const url: string = `${this.baseUrl}/${id}`;
      return this.httpClient.get<Document>(url, { headers: this.getHeaders() });
  }

  public getAllByCategoryName(categoryName: string, pageNumber?: number, pageSize?: number): Observable<GetDocumentResponse> {
    const params = new HttpParams()
        .set('categoryName', categoryName)
        .set('page', pageNumber?.toString() || '0')
        .set('size', pageSize?.toString() || '10');

    return this.httpClient.get<GetDocumentResponse>(`${this.baseUrl}/category`, { params, headers: this.getHeaders() });
  }
}

export interface GetDocumentResponse {
  content: Document[];
  pageable: {
    pageNumber: number;
    pageSize: number
  }
  totalElements: number;
}

export interface DocumentTitleCategorySpecDto {
  titlesAndCategories: string[];
}

export interface DocumentSpecDto {
  titles: string[];
  categories: string[];
}
