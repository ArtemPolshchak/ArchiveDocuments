import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {StorageService} from "./storage.service";
import {Observable, tap} from "rxjs";
import {Registration} from "../common/registration";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(
      private httpClient: HttpClient,
      private router: Router,
      private storageService: StorageService) {
  }

  registration(loginData: Registration): Observable<any> {
    return this.httpClient.post<any>('api/auth/sign-up', loginData).pipe(
        tap(response => {
          this.storageService.saveToken(response.token)
          this.router.navigateByUrl('/documents');
        })
    );
  }
}
