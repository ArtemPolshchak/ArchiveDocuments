import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {Category} from "../common/category";
import {CreateCategory} from "../common/create-category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly baseUrl: string = '/api/category';

  constructor(private httpClient: HttpClient) {
  }

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllCategoriesPaginated(pageNumber?: number, pageSize?: number, sort?: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/?page=${pageNumber}&size=${pageSize}&sort=${sort}`, {headers: this.getHeaders() });
  }

  getAll(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/get`, {headers: this.getHeaders() });
  }

  getAllAndStoreInSessionStorage(): Observable<any> {
    sessionStorage.removeItem('categories');

    return this.getAll().pipe(
        tap(categories => {
          sessionStorage.setItem('categories', JSON.stringify(categories));
        })
    );
  }

  searchCategoriesByName(name: string, pageable: any): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/search`, { params: { name, ...pageable }, headers: this.getHeaders() });
  }

  search(name: string | undefined, pageNumber?: number, pageSize?: number, sort?: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/search?name=${name}&page=${pageNumber}&size=${pageSize}&sort=${sort}`, {headers: this.getHeaders() });
  }

  createCategory(categoryDto: CreateCategory): Observable<any> {
    console.log(categoryDto.name)
    return this.httpClient.post(`${this.baseUrl}`, categoryDto, { headers: this.getHeaders() });
  }

  updateCategory(id: number, categoryDto: Category): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/update/${id}`, categoryDto, { headers: this.getHeaders() });
  }

  deleteCategory(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }
}