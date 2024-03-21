import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../services/auth.service";
import {ADMIN_MENU_ITEMS, GUEST_MENU_ITEMS, MODERATOR_MENU_ITEMS} from "../../enums/app-constans";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
    NgbNavModule,
    NgForOf,
    NgIf,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatButton
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit{
  menuItems: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const isAdmin = this.authService.isAdmin();
    const isModerator = this.authService.isModerator();

    this.menuItems = isAdmin ? ADMIN_MENU_ITEMS : (isModerator ? MODERATOR_MENU_ITEMS : GUEST_MENU_ITEMS);
  }


  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('categories')
    this.router.navigateByUrl('/login');
  }
}
