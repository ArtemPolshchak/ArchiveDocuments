import {Routes} from '@angular/router';
import {UserComponent} from "./components/user/user.component";
import {LoginComponent} from "./components/login/login.component";
import {hasRoleGuard} from "./services/auth.service";
import {Role} from "./enums/app-constans";
import {RegistrationComponent} from "./components/registration/registration.component";
import {DocumentsComponent} from "./components/documents/documents.component";
import {CategoryComponent} from "./components/category/category.component";
import {UpdateDocumentPageComponent} from "./components/documents/update-document-page/update-document-page.component";
import {
    CreateNewDocumentPageComponent
} from "./components/documents/create-new-document-page/create-new-document-page.component";

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: "full", },
    { path: 'login', component: LoginComponent },
    { path: 'registration', component: RegistrationComponent },
    {
        path: 'users',
        component: UserComponent,
        canActivate: [hasRoleGuard],
        data: {
            roles: [ Role.ADMIN ]
        }
    },
    {
        path: 'category',
        component: CategoryComponent,
        canActivate: [hasRoleGuard],
        data: {
            roles: [ Role.ADMIN, Role.MODERATOR, Role.GUEST ]
        }
    },
    {
        path: 'documents',
        component: DocumentsComponent,
        canActivate: [hasRoleGuard],
        data: {
            roles: [ Role.ADMIN, Role.MODERATOR, Role.GUEST ]
        }
    },
    {
        path: 'update-document/:id',
        component: UpdateDocumentPageComponent,
        canActivate: [hasRoleGuard],
        data: {
            roles: [ Role.ADMIN, Role.MODERATOR, Role.GUEST ]
        }
    },
    {
        path: 'create-new-document',
        component: CreateNewDocumentPageComponent,
        canActivate: [hasRoleGuard],
        data: {
            roles: [ Role.ADMIN, Role.MODERATOR ]
        }
    },
    {
        path: 'app-create-new-document-page',
        component: CreateNewDocumentPageComponent,
        canActivate: [hasRoleGuard],
        data: {
            roles: [ Role.ADMIN, Role.MODERATOR ]
        }
    },
    {
        path: 'app-update-document-page',
        component: CreateNewDocumentPageComponent,
        canActivate: [hasRoleGuard],
        data: {
            roles: [ Role.ADMIN, Role.MODERATOR, Role.GUEST ]
        }
    },
    { path: '**', redirectTo: 'login' }
];
